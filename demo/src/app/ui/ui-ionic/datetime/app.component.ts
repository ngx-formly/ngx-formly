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
      key: 'Datetime',
      type: 'datetime',
      templateOptions: {
        label: 'Datetime',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
      },
    },
  ];
}
