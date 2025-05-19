import { Component } from '@angular/core';
import { UntypedFormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { NgFor } from '@angular/common';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  existingUsers = ['user1', 'user2', 'user3'];

  fields: FormlyFieldConfig[] = [
    {
      key: 'username1',
      type: 'input',
      props: {
        label: 'Username (validated using `Promise`)',
        placeholder: 'Username',
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
    {
      key: 'username2',
      type: 'input',
      props: {
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
