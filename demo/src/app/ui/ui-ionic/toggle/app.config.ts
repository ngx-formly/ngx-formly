import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';
import { withFormlyFieldToggle } from '@ngx-formly/ionic/toggle';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyIonic(), withFormlyFieldToggle()])],
};
