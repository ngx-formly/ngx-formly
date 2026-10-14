import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';
import { additionalTypes } from './additional-types.component';
import { provideIonicAngular } from '@ionic/angular';
import { withFormlyFieldDatetime } from '@ngx-formly/ionic/datetime';
import { withFormlyFieldSlider } from '@ngx-formly/ionic/slider';
import { withFormlyFieldToggle } from '@ngx-formly/ionic/toggle';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    provideFormlyCore([
      ...withFormlyIonic(),
      withFormlyFieldDatetime(),
      withFormlyFieldSlider(),
      withFormlyFieldToggle(),
      additionalTypes,
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),
  ],
};
