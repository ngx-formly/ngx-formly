import { FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';
import { FormlyWrapperLabel } from '../wrappers/label';
import { FormlyWrapperFieldset } from '../wrappers/fieldset';
import { FormlyWrapperDescription, FormlyWrapperValidationMessages } from '../wrappers/wrappers';

export class TemplateFieldset {
  run(fc: FormlyConfig) {
    fc.templateManipulators.preWrapper.push((field: FormlyFieldConfig) => {
      if (['label', 'fieldset', 'description', 'validation-message'].some(w => field.wrappers.indexOf(w) !== -1)) {
        console.warn(`The following wrappers ('label', 'fieldset', 'description', 'validation-message') are depecated, rely on 'form-field' wrapper instead`);
      }

      const formFieldIndex = field.wrappers.indexOf('form-field');
      if (
        formFieldIndex !== -1
        && (
          fc.getWrapper('label').component !== FormlyWrapperLabel
          || fc.getWrapper('fieldset').component !== FormlyWrapperFieldset
          || fc.getWrapper('description').component !== FormlyWrapperDescription
          || fc.getWrapper('validation-message').component !== FormlyWrapperValidationMessages
        )
      ) {
        field.wrappers[formFieldIndex] = 'fieldset';
        if (field.type !== 'checkbox') {
          field.wrappers.splice(formFieldIndex, 0, 'label');
        }

        console.warn(`overriding the following wrappers ('label', 'fieldset', 'description', 'validation-message') is deprecated, override 'form-field' wrapper instead`);
      }

      return '';
    });
  }
}
