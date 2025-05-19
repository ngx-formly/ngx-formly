import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

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
      key: 'Range',
      type: 'range',
      props: {
        label: 'Range',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
      },
    },
    {
      key: 'Range-Stacked',
      type: 'range',
      props: {
        label: 'Range (custom label position)',
        labelPosition: 'stacked',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
      },
    },
  ];
}
