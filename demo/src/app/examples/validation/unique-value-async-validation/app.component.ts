import { Component } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  existingUsers = ['user1', 'user2', 'user3'];

  fields: FormlyFieldConfig[] = [
    {
      key: 'username1',
      type: 'input',
      templateOptions: {
        label: 'Username (validated using `Promise`)',
        placeholder: 'Username',
        required: true,
      },
      asyncValidators: {
        uniqueUsername: {
          expression: (control: AbstractControl) => {
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
    {
      key: 'username2',
      type: 'input',
      templateOptions: {
        label: 'Username (validated using `Observable`)',
        placeholder: 'Username',
        required: true,
      },
      asyncValidators: {
        uniqueUsername: {
          expression: (control: AbstractControl) => {
            return of(this.existingUsers.indexOf(control.value) === -1);
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
