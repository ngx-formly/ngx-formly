import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { FormlyFieldButton } from './button-type.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        types: [
          {
            name: 'button',
            component: FormlyFieldButton,
            wrappers: ['form-field'],
            defaultOptions: {
              props: {
                btnType: 'default',
                type: 'button',
              },
            },
          },
        ],
      },
    ]),
  ],
};
