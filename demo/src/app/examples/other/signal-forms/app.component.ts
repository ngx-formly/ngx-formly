import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
})
export class AppComponent {
  form = new FormGroup({});
  model = signal({ name: '', age: 25, range: { start: 1, end: 5 } });
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
    {
      key: 'age',
      type: 'input',
      props: { label: 'Age (updates on blur)', type: 'number' },
      modelOptions: { updateOn: 'blur' },
    },
    {
      key: 'range',
      // The group validator reports its error on the `end` control through setErrors().
      validators: {
        endAfterStart: {
          expression: (c: AbstractControl): boolean => c.value.end > c.value.start,
          message: 'End must be greater than start',
          errorPath: 'end',
        },
      },
      fieldGroupClassName: 'row',
      fieldGroup: [
        { key: 'start', type: 'input', className: 'col-6', props: { label: 'Start', type: 'number' } },
        { key: 'end', type: 'input', className: 'col-6', props: { label: 'End', type: 'number' } },
      ],
    },
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
    if (this.form.valid) {
      alert(JSON.stringify(this.model()));
    }
  }
}
