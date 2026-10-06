import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { additionalTypes } from './additional-types.component';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { withFormlyFieldDatepicker } from '@ngx-formly/primeng/datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: false } } }),
    provideFormlyCore([
      ...withFormlyPrimeNG(),
      withFormlyFieldDatepicker(),
      additionalTypes,
      { validationMessages: [{ name: 'required', message: 'This field is required' }] },
    ]),
  ],
};
