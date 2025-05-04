import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyPrimeNG()])],
};
