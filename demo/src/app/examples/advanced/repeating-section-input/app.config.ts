import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { RepeatTypeComponent } from './repeat-section.type';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        types: [{ name: 'repeat', component: RepeatTypeComponent }],
      },
    ]),
  ],
};
