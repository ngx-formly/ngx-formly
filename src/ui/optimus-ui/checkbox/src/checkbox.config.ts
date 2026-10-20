import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldCheckbox } from './checkbox.type';

export function withFormlyFieldCheckbox(): ConfigOption {
  return {
    types: [
      {
        name: 'checkbox',
        component: FormlyFieldCheckbox,
        wrappers: ['form-field'],
      },
      {
        name: 'boolean',
        extends: 'checkbox',
      },
    ],
  };
}
