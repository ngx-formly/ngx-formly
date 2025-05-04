import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { FORMLY_CONFIG } from '@ngx-formly/core';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '_json');
}

export function formlyValidationConfig(translate: TranslateService) {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return translate.stream('FORM.VALIDATION.REQUIRED');
        },
      },
    ],
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    { provide: FORMLY_CONFIG, multi: true, useFactory: formlyValidationConfig, deps: [TranslateService] },
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),
  ],
};
