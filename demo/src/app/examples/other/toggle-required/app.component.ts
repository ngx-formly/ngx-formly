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
      key: 'checked',
      type: 'checkbox',
      templateOptions: {
        label: 'Required?',
      },
    },
    {
      key: 'text',
      type: 'input',
      templateOptions: {
        label: 'Moehahah',
        placeholder: 'Formly is terrific!',
      },
      validation: {
        show: true,
      },
      expressionProperties: {
        'templateOptions.required': 'model.checked',
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
