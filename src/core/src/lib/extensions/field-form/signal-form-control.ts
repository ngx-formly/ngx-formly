import { Injector, signal, WritableSignal } from '@angular/core';
import { disabled, SchemaFn } from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';

/**
 * `SignalFormControl` rejects the imperative `AbstractControl` API with NG01920.
 * This control forwards it to signals read by Signal Forms rules, so code written
 * for Reactive Forms (Formly itself, `FormGroup.disable()`, consumers) keeps working.
 */
export class FormlySignalFormControl extends SignalFormControl<unknown> {
  private readonly disabledState: WritableSignal<boolean>;

  constructor(value: unknown, isDisabled: boolean, schema: SchemaFn<unknown>, injector?: Injector) {
    // `this` is not available before super(), so the rule closes over a local signal.
    const disabledState = signal(isDisabled);
    super(
      value,
      (p) => {
        disabled(p, { when: () => disabledState() });
        schema(p);
      },
      { injector },
    );
    this.disabledState = disabledState;
  }

  override disable(): void {
    this.disabledState.set(true);
  }

  override enable(): void {
    this.disabledState.set(false);
  }
}
