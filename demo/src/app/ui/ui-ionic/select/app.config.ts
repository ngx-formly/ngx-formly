import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    provideFormlyCore([
      ...withFormlyIonic(),
      { validationMessages: [{ name: 'required', message: 'This field is required' }] },
    ]),
  ],
};
