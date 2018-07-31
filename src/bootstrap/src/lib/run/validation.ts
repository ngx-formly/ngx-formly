import { FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';

export class TemplateValidation {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field: FormlyFieldConfig) => {
      if ((!field.templateOptions || field.templateOptions.descriptionWrapper !== false) && field.wrappers.indexOf('form-field') === -1) {
        return 'validation-message';
      }
    });
  }
}
