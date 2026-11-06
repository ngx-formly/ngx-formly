import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyOptimusUI } from '@ngx-formly/optimus-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyOptimusUI()])],
};
