import { FormlyConfig } from '../../core/services/formly.config';
export class TemplateValidation {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field) => {
      if (field && field.validators) {
        return 'validation-message';
      }
    });
  }
}
