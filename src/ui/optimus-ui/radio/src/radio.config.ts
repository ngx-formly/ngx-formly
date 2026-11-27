import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldRadio } from './radio.type';

export function withFormlyFieldRadio(): ConfigOption {
  return {
    types: [
      {
        name: 'radio',
        component: FormlyFieldRadio,
        wrappers: ['form-field'],
      },
    ],
  };
}
