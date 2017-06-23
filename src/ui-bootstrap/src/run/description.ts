import { FormlyFieldConfig, FormlyConfig } from '../../../core';

export class TemplateDescription {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field: FormlyFieldConfig) => {
      if (field && field.templateOptions && field.templateOptions.description) {
        return 'description';
      }
    });
  }
}
