import { Component } from '@angular/core';
import { UntypedFormGroup, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

export function ipValidator(control: AbstractControl): ValidationErrors {
  return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { ip: true };
}

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'ip',
      type: 'input',
      props: {
        label: 'IP Address (using custom validation declared in ngModule)',
        required: true,
      },
      validators: {
        validation: ['ip'],
      },
    },
    {
      key: 'ip',
      type: 'input',
      props: {
        label: 'IP Address (using custom validation through `validators.validation` property)',
        required: true,
      },
      validators: {
        validation: [ipValidator],
      },
    },
    {
      key: 'ip',
      type: 'input',
      props: {
        label: 'IP Address (using custom validation through `validators.expression` property)',
        description: 'custom validation message through `validators` property',
        required: true,
      },
      validators: {
        ip: {
          expression: (c: AbstractControl) => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
          message: (error: any, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address`,
        },
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
