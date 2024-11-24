import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldMultiCheckbox } from './multicheckbox.type';

export function withFormlyFieldMultiCheckbox(): ConfigOption {
  return {
    types: [
      {
        name: 'multicheckbox',
        component: FormlyFieldMultiCheckbox,
        wrappers: ['form-field'],
      },
    ],
  };
}
