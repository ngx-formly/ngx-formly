import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  // formly-form: disable default hide behavior
  styles: [
    `
      ::ng-deep formly-field {
        display: block !important;
      }
    `,
  ],
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'firstName',
      type: 'input',
      templateOptions: {
        label: 'First name',
        placeholder: 'Type in here to display the hidden field using slideInOut animation',
      },
    },
    {
      key: 'lastname',
      type: 'input',
      hideExpression: model => !this.model.firstName,
      templateOptions: {
        label: 'Last name',
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
