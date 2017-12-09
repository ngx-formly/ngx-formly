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
      key: 'text',
      type: 'input',
      templateOptions: {
        label: 'Some awesome text',
        placeholder: 'Some sweet text',
        required: true,
      },
    },
    {
      key: 'candy',
      type: 'select',
      templateOptions: {
        label: 'Multiple Options',
        options: [
          { label: 'Snickers', value: 'snickers' },
          { label: 'Baby Ruth', value: 'baby_ruth' },
          { label: 'Milky Way', value: 'milky_way' },
        ],
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
