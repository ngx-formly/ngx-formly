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
      key: 'email',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      props: {
        label: 'Email',
        type: 'email',
        placeholder: 'Formly is terrific!',
        required: true,
      },
    },
    {
      key: 'password',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      props: {
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
