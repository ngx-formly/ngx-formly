import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  options: FormlyFormOptions = {
    showValid: (field) => {
      return (
        this.model.showValid &&
        field.formControl.valid &&
        (field.formControl?.touched || field.options.parentForm?.submitted || !!field.field.validation?.show)
      );
    },
  };

  model = {
    showValid: false,
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'req',
      type: 'input-adjusted',
      templateOptions: {
        type: 'input',
        label: 'Required Input',
        required: true,
      },
    },
    {
      key: 'showValid',
      type: 'checkbox',
      templateOptions: {
        label: 'Show valid feedback for form?',
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
