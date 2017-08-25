import { FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';

export class TemplateDescription {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field: FormlyFieldConfig) => {
      if (field && field.templateOptions && field.templateOptions.description) {
        return 'description';
      }
    });
  }
}
