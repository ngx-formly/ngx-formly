import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore(withFormlyMaterial())],
};
