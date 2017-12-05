import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});

  model = {
    lastName: 'Smith',
  };

  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'firstName',
      type: 'input',
      defaultValue: 'This is a default value',
      templateOptions: {
        label: 'First Name (initialized via default value)',
      },
    },
    {
      key: 'lastName',
      type: 'input',
      defaultValue: 'This is a default value',
      templateOptions: {
        label: 'Last Name (initialized via the model)',
      },
    },
    {
      key: 'candy',
      type: 'select',
      defaultValue: 'milky_way',
      templateOptions: {
        label: 'Favorite Candy (initialized via default value',
        options: [
          { label: 'Snickers', value: 'snickers' },
          { label: 'Baby Ruth', value: 'baby_ruth' },
          { label: 'Milky Way', value: 'milky_way' },
        ],
      },
    },
    {
      key: 'agree',
      type: 'checkbox',
      templateOptions: {
        label: 'Agree? (not initialized at all)',
        required: true,
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
