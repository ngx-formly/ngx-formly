import { Injector, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControlState,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { disabled, SchemaFn, validate, ValidationError } from '@angular/forms/signals';
import { CompatValidationError, SignalFormControl } from '@angular/forms/signals/compat';

type UpdateOn = NonNullable<AbstractControlOptions['updateOn']>;

// Set on the control by Angular's forms directives while a typed value waits for blur or submit.
interface PendingState {
  _pendingValue: unknown;
  _pendingChange: boolean;
  _pendingDirty: boolean;
  _pendingTouched: boolean;
}

interface ManualErrors {
  errors: ValidationErrors | null;
  value: unknown;
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
  private readonly manualErrors: WritableSignal<ManualErrors | undefined>;

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
    const manualErrors = signal<ManualErrors | undefined>(undefined);
    const self: { control?: FormlySignalFormControl } = {};
    super(
      defaultValue,
      (p) => {
        disabled(p, { when: () => disabledState() });
        validate(p, ({ value }) => {
          revalidate();
          const control: FormlySignalFormControl | undefined = self.control;
          if (!control) {
            return undefined;
          }

          const manual = manualErrors();
          // A value change is a validation run: manual errors set for a previous value are stale.
          const errors =
            manual && Object.is(manual.value, value()) ? manual.errors : (control.validator?.(control) ?? null);

          return toSignalErrors(errors, control);
        });
        schema(p);
      },
      { injector },
    );
    self.control = this;
    this.disabledState = disabledState;
    this.revalidate = revalidate;
    this.manualErrors = manualErrors;
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

  override disable(): void {
    this.disabledState.set(true);
  }

  override enable(): void {
    this.disabledState.set(false);
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

  override setErrors(errors: ValidationErrors | null): void {
    this.manualErrors.set({ errors, value: this.value });
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

    const next = state ? state.value : value;
    super.reset(next, options);
    // SignalFormControl.reset(undefined) restores a defined initial value and otherwise keeps the current one;
    // FormControl resets to the given value, or to its default value without arguments.
    if (next === undefined && (state || this.defaultValue === undefined)) {
      this.setValue(undefined, options);
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
