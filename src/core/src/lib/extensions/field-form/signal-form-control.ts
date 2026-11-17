import { Injector, linkedSignal, signal, untracked, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControlState,
  FormControlStatus,
  FormResetEvent,
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
  private onlySelfStatus?: FormControlStatus;

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
          const control: FormlySignalFormControl | undefined = self.control;
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
      const onlySelf = status === this.onlySelfStatus;
      this.onlySelfStatus = undefined;
      if (status !== this.lastStatus) {
        this.lastStatus = status;
        if (!onlySelf) {
          this.parent?.updateValueAndValidity();
        }
        emit(status);
      }
    };
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

    return true;
  }

  override disable(opts?: EventOptions): void {
    this.setDisabled(true, opts);
  }

  override enable(opts?: EventOptions): void {
    this.setDisabled(false, opts);
  }

  private setDisabled(isDisabled: boolean, opts?: EventOptions): void {
    this.disabledState.set(isDisabled);
    this.trackStatusOptions(opts);
    if (!opts?.onlySelf) {
      // Events, unless silenced, are emitted when the status effect runs.
      this.parent?.updateValueAndValidity({ emitEvent: false });
    }
  }

  private trackStatusOptions(opts?: EventOptions): void {
    this.onlySelfStatus = opts?.onlySelf ? this.status : undefined;
    if (opts?.emitEvent === false) {
      this.lastStatus = this.status;
    }
  }

  // As on a FormControl, a programmatic value replaces the typed value that waits for blur or submit.
  override setValue(value: unknown, options?: ValueOptions): void {
    this.manualErrors.set(undefined);
    (this as unknown as PendingState)._pendingValue = value;
    super.setValue(value, options);
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
    (
      this.parent as unknown as { _updateControlsErrors?(emitEvent: boolean, changed: AbstractControl): void }
    )?._updateControlsErrors?.(false, this);
  }

  override updateValueAndValidity(): void {
    this.manualErrors.set(undefined);
    this.revalidate.update((count) => count + 1);
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
    this.setValue(next, options);
    this.trackStatusOptions(options);

    Object.assign(this, {
      _pendingValue: this.value,
      _pendingChange: false,
      _pendingDirty: false,
      _pendingTouched: false,
    });
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
