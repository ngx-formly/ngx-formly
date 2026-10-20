import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyOptimusUI } from '@ngx-formly/optimus-ui';
import { additionalTypes } from './additional-types.component';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';
import { withFormlyFieldDatepicker } from '@ngx-formly/optimus-ui/datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOptimus({ theme: { preset: Aura, options: { darkModeSelector: '[data-bs-theme="dark"]' } } }),
    provideFormlyCore([
      ...withFormlyOptimusUI(),
      withFormlyFieldDatepicker(),
      additionalTypes,
      { validationMessages: [{ name: 'required', message: 'This field is required' }] },
    ]),
  ],
};
