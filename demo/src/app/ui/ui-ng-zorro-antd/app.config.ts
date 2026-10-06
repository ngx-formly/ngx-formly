import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyNgZorroAntd } from '@ngx-formly/ng-zorro-antd';
import { additionalTypes } from './additional-types.component';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNzI18n(en_US),
    provideFormlyCore([
      ...withFormlyNgZorroAntd(),
      additionalTypes,
      { validationMessages: [{ name: 'required', message: 'This field is required' }] },
    ]),
  ],
};
