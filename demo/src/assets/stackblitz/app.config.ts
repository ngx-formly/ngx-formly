import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
      // UI_CONFIG
    ]),
  ],
};
