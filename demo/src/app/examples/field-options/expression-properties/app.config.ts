import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore, withFormlyFieldExpression } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      withFormlyFieldExpression(),
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),
  ],
};
