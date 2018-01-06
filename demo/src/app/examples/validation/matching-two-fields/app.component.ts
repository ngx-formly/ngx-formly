import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
      key: 'password',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Password',
        placeholder: 'Must be at least 3 characters',
        required: true,
        minLength: 3,
      },
    },
    {
      key: 'passwordConfirm',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Please re-enter your password',
        required: true,
      },
      validators: {
        fieldMatch: {
          expression: (control) => control.value === this.model.password,
          message: 'Password Not Matching',
        },
      },
      expressionProperties: {
        'templateOptions.disabled': () => !this.form.get('password').valid,
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
