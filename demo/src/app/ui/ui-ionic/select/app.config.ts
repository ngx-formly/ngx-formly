import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    provideFormlyCore([
      ...withFormlyIonic(),
      { validationMessages: [{ name: 'required', message: 'This field is required' }] },
    ]),
  ],
};
