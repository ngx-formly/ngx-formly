import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { FormlyHorizontalWrapper } from './horizontal-wrapper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        wrappers: [{ name: 'form-field-horizontal', component: FormlyHorizontalWrapper }],
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),
  ],
};
