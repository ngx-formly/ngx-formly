import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'checked',
      type: 'checkbox',
      props: {
        label: 'Required?',
      },
    },
    {
      key: 'text',
      type: 'input',
      props: {
        label: 'Moehahah',
        placeholder: 'Formly is terrific!',
      },
      validation: {
        show: true,
      },
      expressions: {
        'props.required': 'model.checked',
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
