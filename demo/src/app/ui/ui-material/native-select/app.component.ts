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
      key: 'NativeSelect',
      type: 'native-select',
      templateOptions: {
        label: 'Native select',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
        options: [
          { value: 1, label: 'Option 1', group: 1 },
          { value: 2, label: 'Option 2', group: 2 },
          { value: 3, label: 'Option 3', group: 3 },
          { value: 4, label: 'Option 4', group: 4 },
        ],
      },
    },
  ];
}
