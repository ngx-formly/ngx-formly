import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyOptimusUI } from '@ngx-formly/optimus-ui';
import { withFormlyFieldDatepicker } from '@ngx-formly/optimus-ui/datepicker';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyOptimusUI(), withFormlyFieldDatepicker()])],
};
