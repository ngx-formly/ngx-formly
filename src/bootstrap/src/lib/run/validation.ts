import { FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';

export class TemplateValidation {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field: FormlyFieldConfig) => 'validation-message');
  }
}
