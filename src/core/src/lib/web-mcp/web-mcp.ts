import { NgZone } from '@angular/core';
import { isObservable, Observable, Subscription } from 'rxjs';
import { FormlyFieldConfig, FormlyFormOptions, FormlyWebMcpOptions } from '../models';
import { FormlyConfig } from '../services/formly.config';
import { clone, isEqualValue } from '../utils';
import { getValidationMessage } from '../templates/validation-message';
import { AgentField, collectFields, inputSchema, isJson, parsePatch, Schema } from './fields';

interface Tool {
  name: string;
  description: string;
  inputSchema: Schema;
  annotations: { untrustedContentHint: boolean; consequentialHint?: boolean };
  execute: (args: unknown, context?: { signal?: AbortSignal }) => Promise<unknown>;
}

interface ModelContext {
  registerTool(tool: Tool, options: { signal: AbortSignal }): unknown;
}

export function modelContext(): ModelContext | undefined {
  const hosts = globalThis as unknown as {
    document?: { modelContext?: ModelContext };
    navigator?: { modelContext?: ModelContext };
  };
  return [hosts.document?.modelContext, hosts.navigator?.modelContext].find(
    (context) => typeof context?.registerTool === 'function',
  );
}

const formNames = new WeakMap<object, number>();
const SETTLE_TIMEOUT = 5000;

export function createWebMcp(root: () => FormlyFieldConfig, config: FormlyConfig, zone: NgZone) {
  return new FormlyWebMcp(root, config, zone);
}

class FormlyWebMcp {
  private readonly context = modelContext();
  private readonly name: string;
  private readonly lifetime = new AbortController();
  private registration?: AbortController;
  private invocation?: AbortController;
  private signature?: string;
  private submit?: FormlyWebMcpOptions['submit'];
  private queued = false;
  private watchedOptions?: FormlyFormOptions;
  private watchedForm: FormlyFieldConfig['form'];
  private watchedFields: FormlyFieldConfig[];
  private events?: Subscription;
  private readonly sources = new Map<Observable<any[]>, { subscription: Subscription; value?: any[] }>();

  constructor(
    private root: () => FormlyFieldConfig,
    private config: FormlyConfig,
    private zone: NgZone,
  ) {
    const id = (formNames.get(this.context) || 0) + 1;
    formNames.set(this.context, id);
    this.name = `formly_${id}`;
    this.refresh();
  }

  refresh() {
    if (this.queued || this.lifetime.signal.aborted) return;
    this.queued = true;
    this.zone.runOutsideAngular(() => {
      queueMicrotask(() => {
        this.queued = false;
        if (!this.lifetime.signal.aborted) void this.register();
      });
    });
  }

  destroy() {
    this.lifetime.abort();
    this.registration?.abort();
    this.invocation?.abort();
    this.events?.unsubscribe();
    this.sources.forEach(({ subscription }) => subscription.unsubscribe());
    this.sources.clear();
  }

  private fields(): AgentField[] {
    const used = new Set<Observable<any[]>>();
    const fields = collectFields(this.root(), !!this.config.extras.webMcp, (field) => {
      const options = field.props?.options;
      if (!isObservable(options)) return options;
      used.add(options);
      if (!this.sources.has(options)) {
        const source: { subscription: Subscription; value?: any[] } = { subscription: new Subscription() };
        this.sources.set(options, source);
        source.subscription.add(
          options.subscribe({
            next: (value) => {
              source.value = value;
              this.refresh();
            },
            error: () => {
              source.value = undefined;
              this.refresh();
            },
          }),
        );
      }
      return this.sources.get(options).value;
    });
    this.sources.forEach(({ subscription }, source) => {
      if (!used.has(source)) {
        subscription.unsubscribe();
        this.sources.delete(source);
      }
    });
    return fields;
  }

  private async register() {
    let controller: AbortController;
    try {
      const root = this.root();
      if (
        root.options !== this.watchedOptions ||
        root.form !== this.watchedForm ||
        root.fieldGroup !== this.watchedFields
      ) {
        this.invocation?.abort();
        this.events?.unsubscribe();
        this.watchedOptions = root.options;
        this.watchedForm = root.form;
        this.watchedFields = root.fieldGroup;
        this.events = root.options.fieldChanges.subscribe(() => this.refresh());
      }
      const fields = this.fields();
      const options = root.options.webMcp || {};
      const name = options.name ?? this.name;
      const schema = inputSchema(fields);
      const signature = JSON.stringify([
        name,
        options.description,
        schema,
        fields.map(({ path, schema }) => [path, !!schema]),
      ]);
      if (signature === this.signature && options.submit === this.submit) return;
      if (this.submit !== options.submit) this.invocation?.abort();
      this.signature = signature;
      this.submit = options.submit;
      this.registration?.abort();
      if (!fields.length) return;
      controller = this.registration = new AbortController();
      for (const action of options.submit ? ['fill', 'submit'] : ['fill']) {
        const toolName = `${action}_${name}`;
        if (!/^[A-Za-z0-9_.-]{1,128}$/.test(toolName))
          throw new Error('WebMCP tool names must use 1–128 letters, digits, underscores, dots or hyphens.');
        const submit = action === 'submit' ? options.submit : undefined;
        await this.context.registerTool(
          {
            name: toolName,
            description: `${options.description || `Form ${name}`}. ${
              submit
                ? 'Apply optional fields, validate the whole form, and submit through the application. Waits for completion.'
                : 'Fill any subset of fields without submitting. Call with {} for field status and validation.'
            } Nested objects merge; repeat sections accept existing row indices only. Returns changed values and validation; passwords are never returned.`,
            inputSchema: schema,
            annotations: { untrustedContentHint: true, ...(submit ? { consequentialHint: true } : {}) },
            execute: (args, context) => this.execute(args, submit, context?.signal),
          },
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;
      }
    } catch {
      if (controller?.signal.aborted || this.lifetime.signal.aborted) return;
      controller?.abort();
      console.error(
        'Formly WebMCP registration failed. Check the tool name, duplicate names, and browser permissions.',
      );
    }
  }

  private async execute(args: unknown, submit?: FormlyWebMcpOptions['submit'], caller?: AbortSignal) {
    if (this.lifetime.signal.aborted || caller?.aborted) return { status: 'cancelled' };
    if (this.invocation) return { status: 'busy' };
    if (submit && this.root().options.webMcp?.submit !== submit) return { status: 'unavailable' };
    const invocation = (this.invocation = new AbortController());
    const abort = () => invocation.abort();
    caller?.addEventListener('abort', abort, { once: true });
    const signal = invocation.signal;
    try {
      const result = await this.zone.run(async () => {
        const initial = this.fields();
        if (!initial.length) return { status: 'unavailable' };
        const writes = parsePatch(args, initial);
        if (!writes)
          return {
            status: 'rejected',
            message:
              'The form is unchanged. Use only available fields, existing row indices, and values matching the tool schema.',
          };
        const changed: string[] = [];
        const started = Date.now();
        let debounceUntil = started;
        for (const { entry, value } of writes) {
          if (signal.aborted) return { status: 'cancelled' };
          const current = this.fields().find((f) => isEqualValue(f.path, entry.path));
          if (
            !current?.writable ||
            current.field.formControl !== entry.field.formControl ||
            !parsePatch(this.patch(entry.path, value), [current])
          ) {
            return { status: 'interrupted', ...(await this.report(changed, signal)) };
          }
          entry.field.formControl.markAsDirty();
          entry.field.formControl.setValue(current.value(value));
          changed.push(JSON.stringify(entry.path));
          const modelOptions = entry.field.modelOptions;
          if (!modelOptions?.updateOn || modelOptions.updateOn === 'change') {
            debounceUntil = Math.max(debounceUntil, Date.now() + (modelOptions?.debounce?.default || 0));
          }
          this.root().options.detectChanges(this.root());
        }
        while (!signal.aborted && (Date.now() < debounceUntil || this.root().form.pending)) {
          if (Date.now() - started >= SETTLE_TIMEOUT) break;
          await this.pause(signal);
        }
        // Let model events and expression updates finish even without async validators.
        await this.pause(signal, 0);
        if (signal.aborted) return { status: 'cancelled' };
        this.root().options.detectChanges(this.root());
        const pending = Date.now() < debounceUntil || this.root().form.pending;
        if (!submit) return { status: 'filled', ...(await this.report(changed, signal)), pending };
        if (pending || !this.root().form.valid)
          return {
            status: pending ? 'pending-validation' : 'validation-failed',
            ...(await this.report(changed, signal)),
            pending,
          };
        if (this.root().options.webMcp?.submit !== submit) return { status: 'unavailable' };
        let failure = false;
        await this.untilCancelled(
          Promise.resolve()
            .then(() => {
              if (!signal.aborted) return submit(clone(this.root().model), signal);
            })
            .catch(() => {
              failure = true;
            }),
          signal,
        );
        if (signal.aborted) return { status: 'cancelled' };
        return {
          status: failure ? 'submission-failed' : this.root().form.valid ? 'submitted' : 'validation-failed',
          ...(await this.report(changed, signal)),
        };
      });
      return signal.aborted ? { status: 'cancelled' } : result;
    } catch {
      return {
        status: signal.aborted ? 'cancelled' : 'failed',
        message: 'The operation could not finish. Inspect the form before retrying.',
      };
    } finally {
      caller?.removeEventListener('abort', abort);
      if (this.invocation === invocation) this.invocation = undefined;
      this.refresh();
    }
  }

  private patch(path: string[], value: unknown): unknown {
    return path.reduceRight((child, key) => ({ [key]: child }), value);
  }

  private async report(changed: string[], signal: AbortSignal) {
    const fields = this.fields();
    const reports = await Promise.all(
      fields.map(async ({ field, path, password, schema, writable }) => {
        const errors = await Promise.all(
          Object.keys(field.formControl.errors || {}).map(async (code) => {
            if (password) return { code };
            let message: unknown;
            try {
              message = getValidationMessage(field, code, this.config);
              if (isObservable(message)) message = await this.firstMessage(message, signal);
            } catch {
              /* A broken message must not prevent validation feedback. */
            }
            return { code, ...(typeof message === 'string' ? { message } : {}) };
          }),
        );
        const value = field.formControl.value;
        return {
          path,
          label: typeof field.props?.label === 'string' ? field.props.label : undefined,
          required: !!field.props?.required,
          empty: value == null || value === '' || (Array.isArray(value) && !value.length),
          writable: writable && !!schema,
          ...(!schema ? { unsupported: true } : {}),
          errors,
        };
      }),
    );
    // Recheck access after asynchronous messages, which may outlive a configuration change.
    const current = this.fields();
    return {
      valid: this.root().form.valid,
      pending: this.root().form.pending,
      fields: reports.filter(({ path }) => current.some((entry) => isEqualValue(entry.path, path))),
      changed: current
        .filter(({ path }) => changed.includes(JSON.stringify(path)))
        .map(({ field, path, password }) => {
          const value = field.formControl.value;
          return { path, ...(!password && isJson(value) ? { value: clone(value) } : { redacted: true }) };
        }),
    };
  }

  private firstMessage(source: Observable<unknown>, signal: AbortSignal): Promise<unknown> {
    return new Promise((resolve) => {
      const subscription = new Subscription();
      const finish = (value?: unknown) => {
        clearTimeout(timer);
        signal.removeEventListener('abort', abort);
        subscription.unsubscribe();
        resolve(value);
      };
      const abort = () => finish();
      const timer = setTimeout(finish, SETTLE_TIMEOUT);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) {
        finish();
        return;
      }
      subscription.add(source.subscribe({ next: finish, error: () => finish(), complete: () => finish() }));
    });
  }

  private pause(signal: AbortSignal, delay = 10): Promise<void> {
    return new Promise((resolve) => {
      const finish = () => {
        clearTimeout(timer);
        signal.removeEventListener('abort', finish);
        resolve();
      };
      const timer = setTimeout(finish, delay);
      signal.addEventListener('abort', finish, { once: true });
      if (signal.aborted) finish();
    });
  }

  private untilCancelled(work: Promise<void>, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
      const finish = () => {
        signal.removeEventListener('abort', finish);
        resolve();
      };
      signal.addEventListener('abort', finish, { once: true });
      if (signal.aborted) finish();
      void work.then(finish, finish);
    });
  }
}
