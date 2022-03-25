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
      modelOptions: {
        debounce: {
          default: 2000,
        },
      },
      props: {
        label: 'Debounce',
      },
    },
    {
      key: 'updateOnBlur',
      type: 'input',
      modelOptions: {
        updateOn: 'blur',
      },
      props: {
        label: '`updateOn` on Blur',
        required: true,
      },
    },
    {
      key: 'updateOnSubmit',
      type: 'input',
      modelOptions: {
        updateOn: 'submit',
      },
      props: {
        label: '`updateOn` on Submit',
        required: true,
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
