import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { additionalTypes } from './additional-types.component';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    provideFormlyCore([
      ...withFormlyBootstrap(),
      additionalTypes,
      { validationMessages: [{ name: 'required', message: 'This field is required' }] },
    ]),
  ],
};
