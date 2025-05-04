import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldDatepicker } from '@ngx-formly/material/datepicker';

export const appConfig: ApplicationConfig = {
  providers: [provideFormlyCore([...withFormlyMaterial(), withFormlyFieldDatepicker()])],
};
