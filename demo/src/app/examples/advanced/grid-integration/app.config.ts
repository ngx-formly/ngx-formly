import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({
  theme: 'legacy',
});

import { GridTypeComponent } from './grid.type';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
        types: [
          {
            name: 'grid',
            component: GridTypeComponent,
            defaultOptions: {
              props: {
                width: '100%',
                height: '400px',
              },
            },
          },
        ],
      },
    ]),
  ],
};
