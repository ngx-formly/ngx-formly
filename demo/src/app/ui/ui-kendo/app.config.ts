import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyKendo } from '@ngx-formly/kendo';
import { additionalTypes } from './additional-types.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyKendo(),
      additionalTypes,
      { validationMessages: [{ name: 'required', message: 'This field is required' }] },
    ]),
  ],
};
