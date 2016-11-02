import { FormlyConfig } from '../../core/services/formly.config';
export class TemplateDescription {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field) => {
      if (field && field.templateOptions && field.templateOptions.description) {
        return 'description';
      }
    });
  }
}
