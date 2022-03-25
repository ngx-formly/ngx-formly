import { Component } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

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
      key: 'name',
      type: 'input',
      props: {
        label: 'Name (custom validation message declared in ngModule)',
        required: true,
        maxLength: 5,
      },
    },
    {
      key: 'ip',
      type: 'input',
      props: {
        label: 'IP Address (custom validation message through `validation` property)',
        required: true,
        pattern: /(\d{1,3}\.){3}\d{1,3}/,
      },
      validation: {
        messages: {
          pattern: (error: any, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address`,
        },
      },
    },
    {
      key: 'ip2',
      type: 'input',
      props: {
        label: 'IP Address (custom validation message through `validators` property)',
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
