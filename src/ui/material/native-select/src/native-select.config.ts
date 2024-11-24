import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldNativeSelect } from './native-select.type';

export function withFormlyFieldNativeSelect(): ConfigOption {
  return {
    types: [
      {
        name: 'native-select',
        component: FormlyFieldNativeSelect,
        wrappers: ['form-field'],
      },
    ],
  };
}
