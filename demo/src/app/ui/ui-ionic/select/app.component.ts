import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'Select',
      type: 'select',
      props: {
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
      props: {
        label: 'Select Multiple',
        labelPosition: 'floating',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
        multiple: true,
        interface: 'popover',
        interfaceOptions: {
          size: 'cover',
          header: 'Options',
        },
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
