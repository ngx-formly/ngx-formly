import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldTextArea } from './textarea.type';

export function withFormlyFieldTextArea(): ConfigOption {
  return {
    types: [
      {
        name: 'textarea',
        component: FormlyFieldTextArea,
        wrappers: ['form-field'],
      },
    ],
  };
}
