import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { CustomFieldType } from './custom-field.type';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
        types: [{ name: 'custom', component: CustomFieldType, wrappers: ['form-field'] }],
      },
    ]),
  ],
};
