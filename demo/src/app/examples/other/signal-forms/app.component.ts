import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
})
export class AppComponent {
  form = new FormGroup({});
  model = signal({ name: '', age: 25 });
  summary = computed(() => `Hello ${this.model().name || '…'}`);

  isRequired = signal(true);
  isDisabled = signal(false);
  isHidden = signal(false);

  options: FormlyFormOptions = { signalForms: true };
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: { label: 'Name' },
      expressions: {
        'props.required': this.isRequired,
        'props.disabled': this.isDisabled,
        hide: this.isHidden,
      },
    },
    { key: 'age', type: 'input', props: { label: 'Age', type: 'number' } },
  ];

  toggleRequired(): void {
    this.isRequired.update((v) => !v);
  }

  toggleDisabled(): void {
    this.isDisabled.update((v) => !v);
  }

  toggleHidden(): void {
    this.isHidden.update((v) => !v);
  }

  submit(): void {
    this.form.markAllAsTouched();
  }
}
