import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

export function IpValidator(control: FormControl): ValidationErrors {
  return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { 'ip': true };
}

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'ip',
      type: 'input',
      templateOptions: {
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
      templateOptions: {
        label: 'IP Address (using custom validation through `validators.validation` property)',
        required: true,
      },
      validators: {
        validation: [IpValidator],
      },
    },
    {
      key: 'ip',
      type: 'input',
      templateOptions: {
        label: 'IP Address (using custom validation through `validators.expression` property)',
        description: 'custom validation message through `validators` property',
        required: true,
      },
      validators: {
        ip: {
          expression: (c) => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
          message: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address`,
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
