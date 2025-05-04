import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';
import { withFormlyFieldSlider } from '@ngx-formly/ionic/slider';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyIonic(), withFormlyFieldSlider()])],
};
