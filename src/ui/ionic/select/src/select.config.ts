import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldSelect } from './select.type';

export function withFormlyFieldSelect(): ConfigOption {
  return {
    types: [
      {
        name: 'select',
        component: FormlyFieldSelect,
        wrappers: ['form-field'],
      },
      { name: 'enum', extends: 'select' },
    ],
  };
}
