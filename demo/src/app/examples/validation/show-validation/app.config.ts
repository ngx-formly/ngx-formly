import { ApplicationConfig } from '@angular/core';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';

import { FormlyValidationFeedbackWrapper } from './validation-feedback.wrapper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        extras: {
          // Show validation feedback as soon as the value changes, or after submit.
          showValidation: (field) => !!(field.formControl?.dirty || field.options.parentForm?.submitted),
        },
        wrappers: [{ name: 'validation-feedback', component: FormlyValidationFeedbackWrapper }],
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),
  ],
};
