import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyIonic } from '@ngx-formly/ionic';
import { withFormlyFieldDatetime } from '@ngx-formly/ionic/datetime';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyIonic(), withFormlyFieldDatetime()])],
};
