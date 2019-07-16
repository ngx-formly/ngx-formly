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
      key: 'firstName',
      type: 'input',
      templateOptions: {
        required: true,
        type: 'text',
        label: 'First Name',
      },
    },
    {
      key: 'address',
      wrappers: ['panel'],
      templateOptions: { label: 'Address' },
      fieldGroup: [{
        key: 'town',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          label: 'Town',
        },
      }],
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
