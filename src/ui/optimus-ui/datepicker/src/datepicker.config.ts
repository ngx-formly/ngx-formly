import { FormlyFieldDatepicker } from './datepicker.type';
import { ConfigOption } from '@ngx-formly/core';

export function withFormlyFieldDatepicker(): ConfigOption {
  return {
    types: [
      {
        name: 'datepicker',
        component: FormlyFieldDatepicker,
        wrappers: ['form-field'],
      },
    ],
  };
}
