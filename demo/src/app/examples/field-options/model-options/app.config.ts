import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore, FormlyFieldConfig } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export function RequiredValidatorMessage(error: unknown, field: FormlyFieldConfig) {
  return `"This required field was validated after ${field.formControl.updateOn}"`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [
          {
            name: 'required',
            message: RequiredValidatorMessage,
          },
        ],
      },
    ]),
  ],
};
