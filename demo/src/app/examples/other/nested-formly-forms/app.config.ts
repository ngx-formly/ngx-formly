import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { PanelWrapperComponent } from './panel-wrapper.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        wrappers: [{ name: 'panel', component: PanelWrapperComponent }],
      },
    ]),
  ],
};
