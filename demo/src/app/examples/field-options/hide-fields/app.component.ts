import { Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Name',
        placeholder: 'Type in here to display the hidden field',
      },
    },
    {
      key: 'iLikeTwix',
      type: 'checkbox',
      props: {
        label: 'I like twix',
      },
      expressions: {
        hide: '!model.name',
      },
    },
    {
      key: 'numericCode',
      type: 'checkbox',
      props: { label: 'Use a numeric code' },
    },
    {
      key: 'code',
      type: 'input',
      shareFormControl: false,
      resetOnHide: false,
      props: {
        label: 'Text code',
        description: 'Converted to uppercase. Switching editors keeps the value.',
        pattern: '^[A-Z0-9]*$',
      },
      parsers: [(value) => (value == null ? value : String(value).toUpperCase())],
      validation: { messages: { pattern: 'Use letters and digits only.' } },
      expressions: { hide: ({ model }) => !!model.numericCode },
    },
    {
      key: 'code',
      type: 'input',
      shareFormControl: false,
      resetOnHide: false,
      props: {
        label: 'Numeric code',
        description: 'Stored as a number. Only the visible editor validates the code.',
        pattern: '^\\d+$',
      },
      parsers: [(value) => (value == null || value === '' || isNaN(Number(value)) ? value : Number(value))],
      validation: { messages: { pattern: 'Use digits only.' } },
      expressions: { hide: ({ model }) => !model.numericCode },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
