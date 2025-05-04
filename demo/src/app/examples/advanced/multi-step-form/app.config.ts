import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

import { FormlyFieldStepper } from './stepper.type';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyMaterial(),
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
        types: [{ name: 'stepper', component: FormlyFieldStepper, wrappers: [] }],
      },
    ]),
  ],
};
