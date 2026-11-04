import { Component } from '@angular/core';
import { UntypedFormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model = {};
  options: FormlyFormOptions = {};

  existingUsers = ['user1', 'user2', 'user3'];

  fields: FormlyFieldConfig[] = [
    {
      key: 'username',
      type: 'input',
      wrappers: ['form-field', 'validation-feedback'],
      props: {
        label: 'Username',
        placeholder: 'Try user1',
        required: true,
      },
      asyncValidators: {
        uniqueUsername: {
          expression: (control: AbstractControl) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(this.existingUsers.indexOf(control.value) === -1);
              }, 1000);
            });
          },
          message: 'This username is already taken.',
        },
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
