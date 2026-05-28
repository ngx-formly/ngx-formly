import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
        types: [
          {
            name: 'password',
            extends: 'input',
            defaultOptions: {
              props: {
                type: 'password',
                label: 'Default Password Field',
              },
            },
          },
        ],
      },
    ]),
  ],
};
