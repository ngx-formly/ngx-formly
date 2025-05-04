import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),

    UserService,
  ],
};
