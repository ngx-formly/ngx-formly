import { Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

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
