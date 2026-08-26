import { ConfigOption } from '@ngx-formly/core';
import { FormlyWrapperFormField } from './form-field.wrapper';

export function withFormlyFormField(): ConfigOption {
  return {
    wrappers: [
      {
        name: 'form-field',
        component: FormlyWrapperFormField,
      },
    ],
  };
}
