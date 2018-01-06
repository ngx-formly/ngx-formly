import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  existingUsers = [
    'user1',
    'user2',
    'user3',
  ];

  fields: FormlyFieldConfig[] = [
    {
      key: 'text',
      type: 'input',
      templateOptions: {
        label: 'Username',
        placeholder: 'Username',
        required: true,
      },
      asyncValidators: {
        uniqueUsername: {
          expression: (control: FormControl) => {
            return new Promise((resolve, reject) => {
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
