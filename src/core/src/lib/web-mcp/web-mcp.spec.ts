import { Component, PLATFORM_ID, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  ConfigOption,
  FieldArrayType,
  FormlyConfig,
  FormlyField,
  FormlyFieldConfig,
  FormlyForm,
  FormlyFormOptions,
  provideFormlyCore,
} from '@ngx-formly/core';
import { createComponent, FormlyInputModule } from '@ngx-formly/core/testing';
import { collectFields, parsePatch } from './fields';

@Component({
  selector: 'formly-test-repeat',
  template: '@for (child of field.fieldGroup; track child) { <formly-field [field]="child" /> }',
  imports: [FormlyField],
})
class Repeat extends FieldArrayType {}

@Component({
  template: '<formly-form [fields]="fields" [model]="model" [options]="options" (modelChange)="changed($event)" />',
  imports: [FormlyForm],
})
class StandaloneHost {
  fields: FormlyFieldConfig[] = [{ key: 'name', type: 'input', webMcp: true }];
  model = signal({ name: 'Before' });
  options: FormlyFormOptions = { webMcp: { name: 'test' } };
  changed = vi.fn();
}

describe('WebMCP', () => {
  let registered: Map<string, any>;
  let api: { registerTool: ReturnType<typeof vi.fn> };
  let original: PropertyDescriptor;
  const field = (key = 'name', extra: FormlyFieldConfig = {}): FormlyFieldConfig => ({ key, type: 'input', ...extra });

  const render = (
    fields = [field()],
    config: ConfigOption = { extras: { webMcp: true } },
    model: any = {},
    options: FormlyFormOptions = { webMcp: { name: 'test' } },
  ) => {
    return createComponent({
      template:
        '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options" (modelChange)="changed($event)" />',
      inputs: { fields, form: new FormGroup<any>({}), model, options, changed: vi.fn() },
      imports: [FormlyInputModule, Repeat],
      config: {
        ...config,
        types: [
          { name: 'repeat', component: Repeat },
          { name: 'select', extends: 'input' },
          { name: 'multicheckbox', extends: 'input' },
          ...(config.types || []),
        ],
      },
    });
  };
  const tool = async (name = 'fill_test') => {
    await vi.waitFor(() => expect(registered.has(name)).toBe(true));
    return registered.get(name);
  };
  const fill = async (args: unknown = {}) => (await tool()).execute(args);

  beforeEach(() => {
    registered = new Map();
    original = Object.getOwnPropertyDescriptor(document, 'modelContext');
    api = {
      registerTool: vi.fn(async (descriptor, { signal }) => {
        await Promise.resolve();
        if (signal.aborted) return;
        if (registered.has(descriptor.name) || !/^[A-Za-z0-9_.-]{1,128}$/.test(descriptor.name))
          throw new Error('Invalid or duplicate name');
        registered.set(descriptor.name, descriptor);
        signal.addEventListener(
          'abort',
          () => {
            if (registered.get(descriptor.name) === descriptor) registered.delete(descriptor.name);
          },
          { once: true },
        );
      }),
    };
    Object.defineProperty(document, 'modelContext', { configurable: true, value: api });
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    if (original) Object.defineProperty(document, 'modelContext', original);
    else delete (document as any).modelContext;
    vi.restoreAllMocks();
  });

  it.each([
    [false, undefined, false],
    [false, true, true],
    [false, false, false],
    [true, undefined, true],
    [true, true, true],
    [true, false, false],
  ])('resolves library %s and field %s to %s', async (global, local, expected) => {
    const { fixture } = render([field('name', { webMcp: local })], { extras: { webMcp: global } });
    await fixture.whenStable();
    if (expected) await tool();
    else {
      await new Promise((resolve) => setTimeout(resolve, 30));
      expect(api.registerTool).not.toHaveBeenCalled();
    }
  });

  it('allows children to opt back into excluded keyed and keyless groups', async () => {
    render([
      {
        webMcp: false,
        fieldGroup: [{ key: 'profile', fieldGroup: [field('name', { webMcp: true }), field('secret')] }],
      },
    ]);
    expect((await tool()).inputSchema.properties.profile.properties).toHaveProperty('name');
    expect((await fill()).fields.map((entry) => entry.path)).toEqual([['profile', 'name']]);
    expect((await fill({ profile: { secret: 'no' } })).status).toBe('rejected');
  });

  it('works through the standalone component and model signals', async () => {
    TestBed.configureTestingModule({
      imports: [FormlyInputModule, StandaloneHost],
      providers: [provideFormlyCore(), provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(StandaloneHost);
    const host = fixture.componentInstance;
    await fixture.whenStable();
    expect((await fill({ name: 'After' })).status).toBe('filled');
    expect(host.model()).toEqual({ name: 'After' });
    expect(fixture.nativeElement.querySelector('input').value).toBe('After');
    expect(host.changed).toHaveBeenCalled();
  });

  it('applies parsers, debounce, validation and partial updates through the live form', async () => {
    const host = render(
      [
        field('name', {
          parsers: [(v) => v?.toUpperCase()],
          modelOptions: { debounce: { default: 25 } },
          props: { minLength: 3 },
        }),
        field('other'),
      ],
      undefined,
      { other: 'Keep' },
    );
    const invalid = await fill({ name: 'a' });
    expect(invalid.valid).toBe(false);
    expect(invalid.fields[0].errors[0].code).toBe('minLength');
    expect(host.model).toEqual({ name: 'A', other: 'Keep' });
    expect(host.form.get('name').dirty).toBe(true);
    expect((await fill({ name: 'alice' })).changed).toEqual([{ path: ['name'], value: 'ALICE' }]);
    expect(host.query<HTMLInputElement>('input').nativeElement.value).toBe('ALICE');
  });

  it.each([
    { unknown: 1 },
    { name: 2 },
    [],
    null,
    JSON.parse('{"__proto__":{"polluted":true}}'),
    { name: 'valid', other: 'forbidden' },
  ])('rejects an invalid patch without writes: %j', async (patch) => {
    const host = render([field(), field('other', { webMcp: false })], undefined, { name: 'Before' });
    expect((await fill(patch)).status).toBe('rejected');
    expect(host.model).toEqual({ name: 'Before' });
    expect(host.form.pristine).toBe(true);
  });

  it('protects hidden, disabled, readonly, excluded and password fields', async () => {
    const host = render(
      [
        field(),
        field('hidden', { hide: true, resetOnHide: false }),
        field('disabled', { props: { disabled: true } }),
        field('readonly', { props: { readonly: true } }),
        field('secret', { webMcp: false }),
        field('password', {
          props: { type: 'password', minLength: 4 },
          validation: { messages: { minLength: () => 'DO NOT LEAK' } },
        }),
      ],
      undefined,
      { name: 'Private', hidden: 'Hidden', secret: 'Secret' },
    );
    const inspect = JSON.stringify(await fill());
    expect(inspect).not.toContain('Private');
    expect(inspect).not.toContain('secret');
    for (const key of ['hidden', 'disabled', 'readonly', 'secret'])
      expect((await fill({ [key]: 'no' })).status).toBe('rejected');
    const result = await fill({ password: 'pwd' });
    expect(JSON.stringify(result)).not.toContain('pwd');
    expect(JSON.stringify(result)).not.toContain('DO NOT LEAK');
    expect(host.model.password).toBe('pwd');
  });

  it('respects exclusions on shared model paths and ignores inactive alternate controls', async () => {
    render([field('name', { webMcp: true }), field('name', { webMcp: false }), field('active', { webMcp: true })]);
    expect((await tool()).inputSchema.properties).not.toHaveProperty('name');
    expect((await fill({ name: 'no' })).status).toBe('rejected');
  });

  it('uses the visible independent editor', async () => {
    const host = render([
      field('name', { shareFormControl: false, hide: true, resetOnHide: false, webMcp: false }),
      field('name', { shareFormControl: false, resetOnHide: false, parsers: [(v) => v?.toUpperCase()] }),
    ]);
    expect((await fill({ name: 'yes' })).status).toBe('filled');
    expect(host.model.name).toBe('YES');
  });

  it('refreshes option schemas and preserves the original object choice', async () => {
    const option = { id: 1 };
    const options = new BehaviorSubject([{ text: 'One', id: option, locked: false }]);
    const host = render([
      field('choice', {
        type: 'select',
        props: { options, labelProp: 'text', valueProp: 'id', disabledProp: 'locked' },
      }),
    ]);
    expect((await tool()).inputSchema.properties.choice.anyOf[0].title).toBe('One');
    await fill({ choice: { id: 1 } });
    expect(host.form.get('choice').value).toBe(option);
    options.next([{ text: 'One', id: option, locked: true }]);
    await vi.waitFor(() =>
      expect(registered.get('fill_test').inputSchema.properties.choice.anyOf).toEqual([{ type: 'null' }]),
    );
    expect((await fill({ choice: { id: 1 } })).status).toBe('rejected');
  });

  it('handles multiselects, mapped groups, and multicheckbox maps', async () => {
    const host = render(
      [
        field('multi', {
          type: 'select',
          props: {
            multiple: true,
            options: [
              {
                label: 'Group',
                group: [
                  { label: 'One', value: 1 },
                  { value: 2, disabled: true },
                ],
              },
            ],
          },
        }),
        field('checks', {
          type: 'multicheckbox',
          props: { options: ['a', 'b'], mapProp: (value) => ({ label: value, value }) },
        }),
      ],
      undefined,
      { multi: [2] },
    );
    expect((await fill({ multi: [1], checks: { a: true } })).status).toBe('filled');
    expect(host.model).toEqual({ multi: [1, 2], checks: { a: true } });
  });

  it('edits existing repeat rows without discarding excluded values or creating rows', async () => {
    const host = render(
      [
        {
          key: 'rows',
          type: 'repeat',
          webMcp: false,
          fieldArray: { fieldGroup: [field('name', { webMcp: true }), field('id')] },
        },
      ],
      undefined,
      {
        rows: [
          { name: 'First', id: 'private' },
          { name: 'Second', id: 'keep' },
        ],
      },
    );
    const before = host.form.get('rows.1');
    expect((await fill({ rows: { 1: { name: 'Changed' } } })).status).toBe('filled');
    expect(host.model.rows).toEqual([
      { name: 'First', id: 'private' },
      { name: 'Changed', id: 'keep' },
    ]);
    expect(host.form.get('rows.1')).toBe(before);
    expect((await fill({ rows: { 2: { name: 'New' } } })).status).toBe('rejected');
    expect((await fill({ rows: [] })).status).toBe('rejected');
    const repeat = host.query('formly-test-repeat').componentInstance as Repeat;
    repeat.add(undefined, { name: 'Human-added' });
    await host.fixture.whenStable();
    await vi.waitFor(() =>
      expect(registered.get('fill_test').inputSchema.properties.rows.properties).toHaveProperty('2'),
    );
  });

  it('refreshes expressions, field replacements, names and submission permission', async () => {
    const options: FormlyFormOptions = { webMcp: { name: 'test', submit: vi.fn() } };
    const host = render(
      [field('name', { expressions: { webMcp: 'field.model.enabled' } })],
      undefined,
      { enabled: true },
      options,
    );
    const stale = await tool('submit_test');
    options.webMcp = { name: 'renamed' };
    host.detectChanges();
    await tool('fill_renamed');
    expect(registered.has('submit_test')).toBe(false);
    expect((await stale.execute({})).status).toBe('unavailable');
    host.setInputs({ fields: [field('replacement')] });
    await vi.waitFor(() => expect(registered.get('fill_renamed').inputSchema.properties).toHaveProperty('replacement'));
    host.fields[0].webMcp = false;
    host.detectChanges();
    await vi.waitFor(() => expect(registered.size).toBe(0));
  });

  it('waits for async validation, submits a snapshot once, and hides callback output', async () => {
    const submit = vi.fn(async (model) => {
      model.name = 'Callback copy';
      return 'DO NOT LEAK' as any;
    });
    const host = render(
      [field('name', { asyncValidators: { valid: { expression: () => of(true).pipe(delay(20)) } } })],
      undefined,
      { secret: 'kept' },
      { webMcp: { name: 'test', submit } },
    );
    const result = await (await tool('submit_test')).execute({ name: 'Alice' });
    expect(result.status).toBe('submitted');
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit.mock.calls[0][0].secret).toBe('kept');
    expect(host.model.name).toBe('Alice');
    expect(JSON.stringify(result)).not.toContain('DO NOT LEAK');
  });

  it('blocks invalid submission and handles callback failures and server errors', async () => {
    const submit = vi.fn(async (): Promise<void> => {
      throw new Error('SECRET');
    });
    const host = render(
      [field('name', { props: { required: true } })],
      undefined,
      {},
      { webMcp: { name: 'test', submit } },
    );
    const submitTool = await tool('submit_test');
    expect((await submitTool.execute({})).status).toBe('validation-failed');
    expect(submit).not.toHaveBeenCalled();
    const failed = await submitTool.execute({ name: 'Alice' });
    expect(failed.status).toBe('submission-failed');
    expect(JSON.stringify(failed)).not.toContain('SECRET');
    submit.mockImplementation(async () => {
      host.form.get('name').setErrors({ server: true });
    });
    expect((await submitTool.execute({ name: 'Bob' })).status).toBe('validation-failed');
  });

  it('prevents overlapping calls and cancels in-flight submission on caller abort and destroy', async () => {
    const submit = vi.fn(() => new Promise<void>(() => {}));
    const host = render(undefined, undefined, {}, { webMcp: { name: 'test', submit } });
    const submitTool = await tool('submit_test');
    const controller = new AbortController();
    const pending = submitTool.execute({ name: 'Alice' }, { signal: controller.signal });
    await vi.waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect((await fill({ name: 'Bob' })).status).toBe('busy');
    controller.abort();
    expect((await pending).status).toBe('cancelled');
    const second = submitTool.execute({});
    await vi.waitFor(() => expect(submit).toHaveBeenCalledTimes(2));
    host.fixture.destroy();
    expect((await second).status).toBe('cancelled');
    expect(registered.size).toBe(0);
  });

  it('reports a validation deadline without submitting', async () => {
    const submit = vi.fn();
    render(
      [field('name', { asyncValidators: { slow: { expression: () => new Promise<boolean>(() => {}) } } })],
      undefined,
      {},
      { webMcp: { name: 'test', submit } },
    );
    expect((await (await tool('submit_test')).execute({ name: 'Alice' })).status).toBe('pending-validation');
    expect(submit).not.toHaveBeenCalled();
  }, 10000);

  it('does not return an old model value while a debounced write is pending', async () => {
    render([field('name', { modelOptions: { debounce: { default: 6000 } } })], undefined, {
      name: 'PREVIOUS PRIVATE VALUE',
    });
    const result = await fill({ name: 'New value' });
    expect(result.pending).toBe(true);
    expect(result.changed).toEqual([{ path: ['name'], value: 'New value' }]);
    expect(JSON.stringify(result)).not.toContain('PREVIOUS PRIVATE VALUE');
  }, 10000);

  it('does not expose an entire group through a custom editor that omits its child configurations', () => {
    const form = new FormGroup({ profile: new FormGroup({ secret: new FormControl('private') }) });
    const root: FormlyFieldConfig = {
      form,
      fieldGroup: [{ key: 'profile', type: 'custom', formControl: form.get('profile') }],
    };
    const fields = collectFields(root, true, () => undefined);
    expect(fields[0].schema).toBeUndefined();
    expect(parsePatch({ profile: { secret: 'changed' } }, fields)).toBeUndefined();
    expect(form.value.profile.secret).toBe('private');
  });

  it('does not let a superseded registration failure remove newer tools', async () => {
    const register = api.registerTool.getMockImplementation();
    let rejectFirst: (error: Error) => void;
    api.registerTool
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectFirst = reject;
          }),
      )
      .mockImplementation(register);
    const host = render();
    await vi.waitFor(() => expect(rejectFirst).toBeDefined());
    host.options.webMcp.name = 'new';
    host.detectChanges();
    await tool('fill_new');
    rejectFirst(new Error('Old registration failed'));
    await Promise.resolve();
    expect(registered.has('fill_new')).toBe(true);
  });

  it('rebuilds after replacing form options and unregisters the previous tools', async () => {
    const host = render();
    await tool();
    host.setInputs({ options: { webMcp: { name: 'new' } } });
    const next = await tool('fill_new');
    expect(registered.has('fill_test')).toBe(false);
    expect((await next.execute({ name: 'Updated' })).status).toBe('filled');
    expect(host.model.name).toBe('Updated');
  });

  it('reports unsupported custom values without serializing them', async () => {
    const host = render(
      [field('file', { props: { type: 'file' } }), field('date', { type: 'custom' })],
      { extras: { webMcp: true }, types: [{ name: 'custom', extends: 'input' }] },
      { date: new Date('2026-01-01') },
    );
    const report = await fill();
    expect(report.fields.every((f) => f.unsupported)).toBe(true);
    expect((await fill({ date: '2026-01-02' })).status).toBe('rejected');
    expect(host.model.date).toBeInstanceOf(Date);
  });

  it('uses the navigator compatibility fallback', async () => {
    const saved = Object.getOwnPropertyDescriptor(navigator, 'modelContext');
    delete (document as any).modelContext;
    Object.defineProperty(navigator, 'modelContext', { configurable: true, value: api });
    try {
      render();
      expect((await fill({ name: 'Alice' })).status).toBe('filled');
    } finally {
      if (saved) Object.defineProperty(navigator, 'modelContext', saved);
      else delete (navigator as any).modelContext;
    }
  });

  it('does not register during SSR or without browser support', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const host = render();
    await host.fixture.whenStable();
    expect(api.registerTool).not.toHaveBeenCalled();
    TestBed.resetTestingModule();
    delete (document as any).modelContext;
    const browser = render();
    await browser.fixture.whenStable();
    expect(api.registerTool).not.toHaveBeenCalled();
  });

  it('reports registration failures without breaking the ordinary form', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    registered.set('fill_test', { owner: 'another form' });
    const host = render();
    await vi.waitFor(() => expect(error).toHaveBeenCalled());
    expect(registered.get('fill_test')).toEqual({ owner: 'another form' });
    host.form.get('name').setValue('Manual');
    expect(host.model.name).toBe('Manual');
  });

  it('generates stable unique names and keeps global defaults out of field configs', async () => {
    const host = createComponent({
      template: '<formly-form [fields]="first" /><formly-form [fields]="second" />',
      inputs: { first: [field()], second: [field()] },
      imports: [FormlyInputModule],
      config: { extras: { webMcp: true } },
    });
    await vi.waitFor(() => expect(registered.size).toBe(2));
    const names = [...registered.keys()];
    host.detectChanges();
    expect([...registered.keys()]).toEqual(names);
    expect(host.first[0].webMcp).toBeUndefined();
    TestBed.inject(FormlyConfig).extras.webMcp = false;
    host.detectChanges();
    await vi.waitFor(() => expect(registered.size).toBe(0));
  });
});
