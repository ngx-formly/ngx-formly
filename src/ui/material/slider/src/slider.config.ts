import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldSlider } from './slider.type';

export function withFormlyFieldSlider(): ConfigOption {
  return {
    types: [
      {
        name: 'slider',
        component: FormlyFieldSlider,
        wrappers: ['form-field'],
      },
    ],
  };
}
