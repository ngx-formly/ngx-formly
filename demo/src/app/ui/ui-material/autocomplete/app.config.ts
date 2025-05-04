import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { AutocompleteTypeComponent } from './autocomplete-type.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyMaterial(),
      {
        types: [
          {
            name: 'autocomplete',
            component: AutocompleteTypeComponent,
            wrappers: ['form-field'],
          },
        ],
      },
    ]),
  ],
};
