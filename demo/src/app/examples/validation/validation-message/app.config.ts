import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore, FormlyFieldConfig } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export function minLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `Should have atleast ${field.props.minLength} characters`;
}

export function maxLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `This value should be less than ${field.props.maxLength} characters`;
}

export function minValidationMessage(error: any, field: FormlyFieldConfig) {
  return `This value should be more than ${field.props.min}`;
}

export function maxValidationMessage(error: any, field: FormlyFieldConfig) {
  return `This value should be less than ${field.props.max}`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [
          { name: 'required', message: 'This field is required' },
          { name: 'minLength', message: minLengthValidationMessage },
          { name: 'maxLength', message: maxLengthValidationMessage },
          { name: 'min', message: minValidationMessage },
          { name: 'max', message: maxValidationMessage },
        ],
      },
    ]),
  ],
};
