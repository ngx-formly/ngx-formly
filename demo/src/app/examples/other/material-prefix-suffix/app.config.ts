import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

import { FormlyWrapperAddons } from './addons.wrapper';
import { addonsExtension } from './addons.extension';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyMaterial(),
      {
        wrappers: [{ name: 'addons', component: FormlyWrapperAddons }],
        extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
      },
    ]),
  ],
};
