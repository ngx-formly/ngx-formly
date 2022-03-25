import { FormlyFieldConfig } from '@ngx-formly/core';

export function addonsExtension(field: FormlyFieldConfig) {
  if (!field.props || (field.wrappers && field.wrappers.indexOf('addons') !== -1)) {
    return;
  }

  if (field.props.addonLeft || field.props.addonRight) {
    field.wrappers = [...(field.wrappers || []), 'addons'];
  }
}
