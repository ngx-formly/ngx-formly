import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Name (required)',
        required: true,
      },
    },
    {
      key: 'age',
      type: 'input',
      props: {
        label: 'Age (min= 18, max= 40)',
        type: 'number',
        min: 18,
        max: 40,
        required: true,
      },
    },
    {
      key: 'amount',
      type: 'input',
      props: {
        label: 'Amount (step = 0.01)',
        type: 'number',
        step: 0.01,
        description: '123.45 is valid; 123.456 is not.',
      },
      validation: {
        show: true,
        messages: { step: 'Enter an amount in increments of 0.01.' },
      },
    },
    {
      key: 'password',
      type: 'input',
      props: {
        label: 'Password (minLength = 6)',
        type: 'password',
        required: true,
        minLength: 6,
      },
    },
    {
      key: 'comment',
      type: 'textarea',
      props: {
        label: 'Comment (maxLength = 100)',
        required: true,
        maxLength: 100,
        rows: 5,
      },
    },
    {
      key: 'ip',
      type: 'input',
      props: {
        label: 'IP Address (pattern = /(d{1,3}.){3}d{1,3}/)',
        pattern: /(\d{1,3}\.){3}\d{1,3}/,
        required: true,
      },
      validation: {
        messages: {
          pattern: (error: any, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address`,
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
