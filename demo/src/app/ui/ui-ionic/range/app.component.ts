import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
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
