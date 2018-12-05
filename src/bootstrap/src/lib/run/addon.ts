import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

export class TemplateAddons {
  run(fc: FormlyConfig) {
    fc.templateManipulators.postWrapper.push((field: FormlyFieldConfig) => {
      if (field && field.templateOptions && (field.templateOptions.addonLeft || field.templateOptions.addonRight)) {
        return 'addons';
      }

      return '';
    });
  }
}
