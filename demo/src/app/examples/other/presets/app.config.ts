import { ApplicationConfig } from '@angular/core';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { provideFormlyPreset } from '@ngx-formly/core/preset';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { registerSalutationPreset, SALUTATION_OPTIONS } from './salutation.preset';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: SALUTATION_OPTIONS,
      useValue: ['Mr.', 'Ms.', 'Dr.', 'Dude'],
    },
    {
      provide: FORMLY_CONFIG,
      useFactory: registerSalutationPreset,
      deps: [SALUTATION_OPTIONS],
      multi: true,
    },

    provideFormlyPreset(),
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        presets: [
          {
            name: 'firstName',
            config: {
              key: 'firstName',
              type: 'input',
              props: {
                label: 'First Name',
              },
            },
          },
          {
            name: 'lastName',
            config: {
              key: 'lastName',
              type: 'input',
              props: {
                label: 'Last Name',
              },
            },
          },
        ],
      },
    ]),
  ],
};
