import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { disabled, FormField, required } from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, JsonPipe],
})
export class AppComponent {
  // Declared before `name`: its schema reads them.
  isRequired = signal(true);
  isDisabled = signal(false);

  name = new SignalFormControl('', (p) => {
    required(p, { message: 'Name is required', when: () => this.isRequired() });
    disabled(p, { when: () => this.isDisabled() });
  });

  form = new FormGroup({ name: this.name, age: new FormControl(25) });

  nameState = computed(() => this.name.fieldTree());
  summary = computed(() => `Hello ${this.name.sourceValue() || '…'}`);

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  // Plain Reactive Forms behavior: a disabled control is left out of the parent value and validity.
  expected = computed(() => {
    const value = this.name.sourceValue();
    const control = this.isDisabled() ? 'DISABLED' : this.isRequired() && !value ? 'INVALID' : 'VALID';
    return {
      control,
      groupStatus: control === 'INVALID' ? 'INVALID' : 'VALID',
      groupValue: this.isDisabled() ? { age: 25 } : { name: value, age: 25 },
    };
  });

  replaceExternally(): void {
    this.name.setValue('Alice');
  }

  reset(): void {
    this.name.reset();
  }

  submit(): void {
    this.form.markAllAsTouched();
  }

  toggleRequired(): void {
    this.isRequired.update((v) => !v);
  }

  toggleDisabled(): void {
    this.isDisabled.update((v) => !v);
  }
}
