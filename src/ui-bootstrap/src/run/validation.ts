import { FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';

export class TemplateValidation {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field: FormlyFieldConfig) => {
      if (field && (field.validators || field.asyncValidators)) {
        return 'validation-message';
      }
    });
  }
}
