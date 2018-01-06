import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  options: FormlyFormOptions = {};

  model = {
    showErrorState: true,
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Email',
        required: true,
      },
      validation: {
        show: true,
      },
      expressionProperties: {
        'validation.show': 'model.showErrorState',
      },
    },
    {
      key: 'showErrorState',
      type: 'checkbox',
      templateOptions: {
        label: 'Force show error state',
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
