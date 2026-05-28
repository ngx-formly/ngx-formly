import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldToggle } from './toggle.type';

export function withFormlyFieldToggle(): ConfigOption {
  return {
    types: [
      {
        name: 'toggle',
        component: FormlyFieldToggle,
        wrappers: ['form-field'],
      },
    ],
  };
}
