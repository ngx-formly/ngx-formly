import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { FormlyFieldFile } from './file-type.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        types: [{ name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] }],
      },
    ]),
  ],
};
