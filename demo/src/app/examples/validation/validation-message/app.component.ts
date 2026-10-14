import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig, FormlyValidationMessagesPipe } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm, AsyncPipe, FormlyValidationMessagesPipe],
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
        label: 'Name (globally configured validation message)',
        required: true,
        maxLength: 5,
      },
    },
    {
      fieldGroup: [
        {
          key: 'ip',
          type: 'input',
          props: {
            label: 'IP Address (message through `validation`)',
            required: true,
            pattern: /(\d{1,3}\.){3}\d{1,3}/,
          },
          validation: {
            messages: {
              pattern: (error: any, field: FormlyFieldConfig) =>
                `"${field.formControl.value}" is not a valid IP Address`,
            },
          },
        },
        {
          key: 'ip2',
          type: 'input',
          props: {
            label: 'Second IP Address (message through `validators`)',
            description: 'This field appears after you enter a name.',
            required: true,
          },
          expressions: { hide: (field) => !field.model.name },
          validators: {
            ip: {
              expression: (c: AbstractControl) => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
              message: (error: any, field: FormlyFieldConfig) =>
                `"${field.formControl.value}" is not a valid IP Address`,
            },
          },
        },
      ],
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
