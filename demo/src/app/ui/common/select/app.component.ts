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
      key: 'Select',
      type: 'select',
      templateOptions: {
        label: 'Select',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
        options: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
          { value: 3, label: 'Option 3' },
          { value: 4, label: 'Option 4', disabled: true },
        ],
      },
    },
    {
      key: 'select_multi',
      type: 'select',
      templateOptions: {
        label: 'Select Multiple',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
        multiple: true,
        selectAllOption: 'Select All',
        options: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
          { value: 3, label: 'Option 3' },
          { value: 4, label: 'Option 4', disabled: true },
        ],
      },
    },
  ];
}
