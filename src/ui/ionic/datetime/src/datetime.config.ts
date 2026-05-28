import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldDatetime } from './datetime.type';

export function withFormlyFieldDatetime(): ConfigOption {
  return {
    types: [
      {
        name: 'datetime',
        component: FormlyFieldDatetime,
        wrappers: ['form-field'],
      },
    ],
  };
}
