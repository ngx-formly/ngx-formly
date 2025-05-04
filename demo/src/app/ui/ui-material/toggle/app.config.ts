import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldToggle } from '@ngx-formly/material/toggle';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
      ...withFormlyMaterial(),
      withFormlyFieldToggle(),
    ]),
  ],
};
