import { Injector, linkedSignal, signal, untracked, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  ControlEvent,
  FormArray,
  FormControlState,
  FormControlStatus,
  FormGroup,
  FormResetEvent,
  PristineChangeEvent,
  TouchedChangeEvent,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { disabled, SchemaFn, validate, ValidationError } from '@angular/forms/signals';
import { CompatValidationError, SignalFormControl } from '@angular/forms/signals/compat';
import { Subject } from 'rxjs';

type UpdateOn = NonNullable<AbstractControlOptions['updateOn']>;
type EventOptions = { onlySelf?: boolean; emitEvent?: boolean };
type ValueOptions = Parameters<SignalFormControl<unknown>['setValue']>[1];

// Set on the control by Angular's forms directives while a typed value waits for blur or submit.
interface PendingState {
  _pendingValue: unknown;
  _pendingChange: boolean;
  _pendingDirty: boolean;
  _pendingTouched: boolean;
}

// What a FormControl calls on its parent to recompute it without resetting the siblings.
interface ParentInternals {
  _updateControlsErrors(emitEvent: boolean, changed: AbstractControl): void;
  _updatePristine(opts: EventOptions, changed: AbstractControl): void;
  _updateTouched(opts: EventOptions, changed: AbstractControl): void;
}

/**
 * `SignalFormControl` rejects the imperative `AbstractControl` API with NG01920.
 * This control forwards it to signals read by Signal Forms rules, so code written
 * for Reactive Forms (Formly itself, `FormGroup.disable()`, consumers) keeps working.
 */
export class FormlySignalFormControl extends SignalFormControl<unknown> {
  private readonly disabledState: WritableSignal<boolean>;
  // Validators are plain functions: bumping this signal re-runs the rule that calls them.
  private readonly revalidate: WritableSignal<number>;
  // Errors set with setErrors(); they replace the validators until the next validation run, as on a FormControl.
  private readonly manualErrors: WritableSignal<ValidationErrors | null | undefined>;
  // Last status that statusChanges emitted, or that a call with `emitEvent: false` asked not to emit.
  private lastStatus?: string;
  // A call that did not pass `emitEvent: false` changed the status, and the status effect has not emitted it yet.
  private statusEmitPending = false;
  // Above 0 while valueChanges emits: subscriber calls belong to the change being emitted.
  private valueEmitDepth = 0;
  // Status the parent was already updated for by the call that changed it.
  private parentSyncedStatus?: FormControlStatus;
  // Dirty and touched states the parent already reflects.
  private readonly synced = { dirty: false, touched: false };
  // Event a dirty or touched effect of SignalFormControl just emitted, before it reads `parent`.
  private effectEvent?: PristineChangeEvent | TouchedChangeEvent;

  constructor(
    private readonly defaultValue: unknown,
    isDisabled: boolean,
    schema: SchemaFn<unknown>,
    injector?: Injector,
    private readonly updateStrategy?: UpdateOn,
  ) {
    // `this` is not available before super(), so the rules close over locals.
    const disabledState = signal(isDisabled);
    const revalidate = signal(0);
    const self: { control?: FormlySignalFormControl } = {};
    super(
      defaultValue,
      (p) => {
        disabled(p, { when: () => disabledState() });
        validate(p, () => {
          revalidate();
          const control = self.control;
          if (!control) {
            return undefined;
          }

          const manual = control.manualErrors();
          const errors = manual !== undefined ? manual : (control.validator?.(control) ?? null);

          return toSignalErrors(errors, control);
        });
        schema(p);
      },
      { injector },
    );
    this.disabledState = disabledState;
    this.revalidate = revalidate;
    this.manualErrors = linkedSignal({ source: this.sourceValue, computation: (): undefined => undefined });
    self.control = this;

    // SignalFormControl emits its status from an effect, after the call that asked for `emitEvent: false` returned.
    // The effect also runs again when the status was read between two writes that cancel out (a group validator
    // that clears and sets an error on this control), so an unchanged status is not emitted.
    const statusChanges = this.statusChanges;
    const emit = statusChanges.emit.bind(statusChanges);
    statusChanges.emit = (status: FormControlStatus) => {
      const parentSynced = status === this.parentSyncedStatus;
      this.parentSyncedStatus = undefined;
      this.statusEmitPending = false;
      if (status !== this.lastStatus) {
        this.lastStatus = status;
        if (!parentSynced) {
          // Status only, as FormControl.setErrors() does: the parent's own validators and errors are kept.
          (this.parent as unknown as ParentInternals | null)?._updateControlsErrors(true, this);
        }
        emit(status);
      }
    };

    // SignalFormControl emits valueChanges from an effect, after the call that set the value returned. A subscriber
    // that normalizes the value with `emitEvent: false` must not silence the status of that change.
    const valueChanges = this.valueChanges;
    const emitValue = valueChanges.emit.bind(valueChanges);
    let lastSubmitValue: unknown = Symbol();
    valueChanges.emit = (value: unknown) => {
      if (this.updateOn === 'submit') {
        // A pending edit is emitted during submit, before the value effect sees it.
        if (Object.is(lastSubmitValue, value)) return;
        lastSubmitValue = value;
      }
      this.valueEmitDepth++;
      try {
        emitValue(value);
      } finally {
        this.valueEmitDepth--;
      }
    };

    // The dirty and touched effects of SignalFormControl emit their event, then call markAsPristine() or
    // markAsUntouched() on `parent`, which also resets every sibling. That `parent` read returns null and the
    // ancestors are recomputed instead, as a FormControl does.
    // ponytail: relies on that order in @angular/forms 22.2-22.3; the sibling specs fail if it changes.
    const base = this as unknown as { emitControlEvent(event: ControlEvent): void };
    const emitControlEvent = base.emitControlEvent.bind(this);
    base.emitControlEvent = (event: ControlEvent) => {
      emitControlEvent(event);
      if ((event instanceof PristineChangeEvent || event instanceof TouchedChangeEvent) && event.source === this) {
        this.effectEvent = event;
      }
    };
  }

  override get parent(): FormGroup | FormArray | null {
    const event = this.effectEvent;
    if (!event) {
      return super.parent;
    }

    this.effectEvent = undefined;
    const state = event instanceof PristineChangeEvent ? 'dirty' : 'touched';
    if (this[state] !== this.synced[state]) {
      this.syncParent(state);
    }

    return null;
  }

  // The forms directives read `updateOn` to decide when a typed value reaches the control.
  override get updateOn(): UpdateOn {
    return this.updateStrategy ?? super.updateOn;
  }

  // Called by FormGroupDirective on submit; same steps as FormControl, which SignalFormControl skips.
  _syncPendingControls(): boolean {
    const pending = this as unknown as PendingState;
    if (this.updateOn !== 'submit') {
      return false;
    }
    if (pending._pendingDirty) {
      this.markAsDirty();
    }
    if (pending._pendingTouched) {
      this.markAsTouched();
    }
    if (!pending._pendingChange) {
      return false;
    }
    this.setValue(pending._pendingValue, { onlySelf: true, emitModelToViewChange: false });
    this.valueChanges.emit(this.value);

    return true;
  }

  override disable(opts?: EventOptions): void {
    this.disabledState.set(true);
    this.updateParent(opts);
  }

  override enable(opts?: EventOptions): void {
    this.disabledState.set(false);
    this.updateParent(opts);
  }

  // The status effect emits this control's status unless `emitEvent: false`; the parent is updated here.
  private updateParent(opts?: EventOptions, sourceControl?: AbstractControl): void {
    this.trackStatusOptions(opts);
    if (!opts?.onlySelf) {
      this.parent?.updateValueAndValidity({ emitEvent: opts?.emitEvent, sourceControl } as EventOptions);
    }
  }

  // When it is unclear whether a status should be emitted, it is emitted.
  private trackStatusOptions(opts?: EventOptions): void {
    if (this.valueEmitDepth > 0) {
      return;
    }

    this.parentSyncedStatus = this.status;
    if (opts?.emitEvent !== false) {
      this.statusEmitPending = this.status !== this.lastStatus;
    } else if (!this.statusEmitPending) {
      this.lastStatus = this.status;
    }
  }

  override markAsDirty(opts?: EventOptions): void {
    super.markAsDirty(opts);
    this.synced.dirty = true;
  }

  override markAsTouched(opts?: EventOptions): void {
    super.markAsTouched(opts);
    this.synced.touched = true;
  }

  // SignalFormControl calls markAsPristine() and markAsUntouched() on the parent, which resets the siblings.
  override markAsPristine(opts?: EventOptions): void {
    super.markAsPristine({ onlySelf: true });
    (this as unknown as PendingState)._pendingDirty = false;
    this.syncParent('dirty', opts);
  }

  override markAsUntouched(opts?: EventOptions): void {
    super.markAsUntouched({ onlySelf: true });
    (this as unknown as PendingState)._pendingTouched = false;
    this.syncParent('touched', opts);
  }

  private syncParent(state: 'dirty' | 'touched', opts: EventOptions = {}): void {
    this.synced[state] = this[state];
    if (opts.onlySelf) {
      return;
    }

    const update = state === 'dirty' ? '_updatePristine' : '_updateTouched';
    (this.parent as unknown as ParentInternals | null)?.[update](opts, this);
  }

  // As on a FormControl, a programmatic value replaces the typed value that waits for blur or submit.
  override setValue(value: unknown, options?: ValueOptions): void {
    this.manualErrors.set(undefined);
    (this as unknown as PendingState)._pendingValue = value;
    // SignalFormControl updates the parent with these options.
    super.setValue(value, options);
    this.trackStatusOptions(options);
  }

  override patchValue(value: unknown, options?: ValueOptions): void {
    this.setValue(value, options);
  }

  override setValidators(validators: ValidatorFn | ValidatorFn[] | null): void {
    // AbstractControl stores them and exposes the composed function as `validator`.
    AbstractControl.prototype.setValidators.call(this, validators);
    this.updateValueAndValidity();
  }

  // AbstractControl implements these on top of setValidators(), which this control forwards.
  override addValidators(validators: ValidatorFn | ValidatorFn[]): void {
    AbstractControl.prototype.addValidators.call(this, validators);
  }

  override removeValidators(validators: ValidatorFn | ValidatorFn[]): void {
    AbstractControl.prototype.removeValidators.call(this, validators);
  }

  override clearValidators(): void {
    this.setValidators(null);
  }

  override addAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void {
    this.setAsyncValidators(validators);
  }

  override removeAsyncValidators(): void {}

  override clearAsyncValidators(): void {}

  override setAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[] | null): void {
    if (validators && (!Array.isArray(validators) || validators.length)) {
      throw new Error('[Formly Error] Async validators are not supported on a signal form control.');
    }
  }

  override setErrors(errors: ValidationErrors | null, opts?: { emitEvent?: boolean }): void {
    this.manualErrors.set(errors);
    this.trackStatusOptions(opts);
    // Same internal call as FormControl.setErrors(): recomputes the status of the ancestors only.
    (this.parent as unknown as ParentInternals | null)?._updateControlsErrors(opts?.emitEvent !== false, this);
  }

  override updateValueAndValidity(opts?: EventOptions): void {
    this.manualErrors.set(undefined);
    this.revalidate.update((count) => count + 1);
    this.updateParent(opts, this);
  }

  // SignalFormControl rejects the `{ value, disabled }` form, which Formly uses when hiding a field.
  override reset(value?: unknown, options?: Parameters<SignalFormControl<unknown>['reset']>[1]): void {
    const state = isFormControlState(value) ? value : undefined;
    if (state) {
      this.disabledState.set(state.disabled);
    }

    const next = state ? state.value : value === undefined ? this.defaultValue : value;
    // A value passed to the field-tree reset notifies the parent without respecting control options.
    this.fieldTree().reset();
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(next, options);

    (this as unknown as PendingState)._pendingChange = false;
    if (options?.emitEvent !== false) {
      untracked(() => (this as unknown as { _events: Subject<FormResetEvent> })._events.next(new FormResetEvent(this)));
    }
  }
}

// Same check as Angular's internal `isFormControlState`.
function isFormControlState(value: unknown): value is FormControlState<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).length === 2 &&
    'value' in value &&
    'disabled' in value
  );
}

// CompatValidationError round-trips: `control.errors` returns the original `{ [kind]: context }`.
function toSignalErrors(
  errors: ValidationErrors | null,
  control: AbstractControl,
): ValidationError.WithoutFieldTree[] | undefined {
  if (!errors) {
    return undefined;
  }

  // The class declares `fieldTree`, but it is only assigned by Signal Forms after the rule returns.
  return Object.entries(errors).map(
    ([kind, context]: [string, unknown]) => new CompatValidationError({ kind, context, control }),
  ) as unknown as ValidationError.WithoutFieldTree[];
}
