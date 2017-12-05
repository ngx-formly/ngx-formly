import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'horizontalInput',
      templateOptions: {
        label: 'Email',
        type: 'email',
        placeholder: 'Formly is terrific!',
        required: true,
      },
    },
    {
      key: 'password',
      type: 'horizontalInput',
      templateOptions: {
        label: 'Password',
        type: 'password',
        placeholder: 'Formly is terrific!',
        required: true,
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
