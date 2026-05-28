import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore, FormlyFieldConfig } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { AbstractControl } from '@angular/forms';

export function minLengthValidationMessages(error: any, field: FormlyFieldConfig) {
  return `Should have atleast ${field.props.minLength} characters`;
}

export function fieldMatchValidator(control: AbstractControl) {
  const { password, passwordConfirm } = control.value;

  // avoid displaying the message error when values are empty
  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}

import { AppComponent } from './app.component';
export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validators: [{ name: 'fieldMatch', validation: fieldMatchValidator }],
        validationMessages: [
          { name: 'required', message: 'This field is required' },
          { name: 'minLength', message: minLengthValidationMessages },
        ],
      },
    ]),
  ],
};
