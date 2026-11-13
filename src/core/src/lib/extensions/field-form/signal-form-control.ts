import { Injector, signal, WritableSignal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { disabled, SchemaFn, validate, ValidationError } from '@angular/forms/signals';
import { CompatValidationError, SignalFormControl } from '@angular/forms/signals/compat';

/**
 * `SignalFormControl` rejects the imperative `AbstractControl` API with NG01920.
 * This control forwards it to signals read by Signal Forms rules, so code written
 * for Reactive Forms (Formly itself, `FormGroup.disable()`, consumers) keeps working.
 */
export class FormlySignalFormControl extends SignalFormControl<unknown> {
  private readonly disabledState: WritableSignal<boolean>;
  // Validators are plain functions: bumping this signal re-runs the rule that calls them.
  private readonly revalidate: WritableSignal<number>;

  constructor(value: unknown, isDisabled: boolean, schema: SchemaFn<unknown>, injector?: Injector) {
    // `this` is not available before super(), so the rules close over locals.
    const disabledState = signal(isDisabled);
    const revalidate = signal(0);
    const self: { control?: FormlySignalFormControl } = {};
    super(
      value,
      (p) => {
        disabled(p, { when: () => disabledState() });
        validate(p, () => {
          revalidate();
          const control = self.control;

          return control ? toSignalErrors(control.validator?.(control) ?? null, control) : undefined;
        });
        schema(p);
      },
      { injector },
    );
    self.control = this;
    this.disabledState = disabledState;
    this.revalidate = revalidate;
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

  override setAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[] | null): void {
    if (validators && (!Array.isArray(validators) || validators.length)) {
      throw new Error('[Formly Error] Async validators are not supported on a signal form control.');
    }
  }

  override updateValueAndValidity(): void {
    this.revalidate.update((count) => count + 1);
  }
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
