import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore, FormlyFieldConfig } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { ValidationErrors, AbstractControl } from '@angular/forms';

export function dateFutureValidator(
  control: AbstractControl,
  field: FormlyFieldConfig,
  options = {},
): ValidationErrors {
  return { 'date-future': { message: `Validator options: ${JSON.stringify(options)}` } };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validators: [
          {
            name: 'date-future',
            validation: dateFutureValidator,
            options: { days: 2 },
          },
        ],
      },
    ]),
  ],
};
