import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore, FormlyFieldConfig } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function IpValidator(control: AbstractControl): ValidationErrors {
  return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { ip: true };
}

export function IpValidatorMessage(error: any, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validators: [{ name: 'ip', validation: IpValidator }],
        validationMessages: [
          { name: 'ip', message: IpValidatorMessage },
          { name: 'required', message: 'This field is required' },
        ],
      },
    ]),
  ],
};
