import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldInput } from './text-field.type';

export function withFormlyFieldInput(): ConfigOption {
  return {
    types: [
      {
        name: 'text-field',
        component: FormlyFieldInput,
        wrappers: ['form-field'],
      },
      { name: 'input', extends: 'text-field' },
      { name: 'string', extends: 'input' },
      {
        name: 'number',
        extends: 'input',
        defaultOptions: {
          props: {
            type: 'number',
          },
        },
      },
      {
        name: 'integer',
        extends: 'input',
        defaultOptions: {
          props: {
            type: 'number',
          },
        },
      },
    ],
  };
}
