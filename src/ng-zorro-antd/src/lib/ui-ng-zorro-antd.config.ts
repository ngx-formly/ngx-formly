import { ConfigOption } from '@ngx-formly/core';
import {
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldRadio,
  FormlyFieldSelect,
  FormlyFieldTextArea,
  FormlyFieldInputNumber,
  FormlyFieldCascader,
} from './types/types';
import { FormlyWrapperFormField } from './wrappers/wrappers';


export const FIELD_TYPE_COMPONENTS = [
  // types
  FormlyFieldCascader,
  FormlyFieldCheckbox,
  FormlyFieldInput,
  FormlyFieldInputNumber,
  FormlyFieldRadio,
  FormlyFieldSelect,
  FormlyFieldTextArea,
  // wrappers
  FormlyWrapperFormField,
];

export const NG_ZORRO_ANTD_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: 'cascader',
      component: FormlyFieldCascader,
      wrappers: ['form-field'],
    },
    {
      name: 'input',
      component: FormlyFieldInput,
      wrappers: ['form-field'],
    },
    {
      name: 'input-number',
      component: FormlyFieldInputNumber,
      wrappers: ['form-field'],
    },
    {
      name: 'checkbox',
      component: FormlyFieldCheckbox,
      wrappers: ['form-field'],
    },
    // {
    //   name: 'datetime',
    //   component: FormlyFieldDatetime,
    //   wrappers: ['form-field'],
    // },
    {
      name: 'radio',
      component: FormlyFieldRadio,
      wrappers: ['form-field'],
    },
    // {
    //   name: 'toggle',
    //   component: FormlyFieldToggle,
    //   wrappers: ['form-field'],
    // },
    {
      name: 'select',
      component: FormlyFieldSelect,
      wrappers: ['form-field'],
    },
    // {
    //   name: 'range',
    //   component: FormlyFieldRange,
    //   wrappers: ['form-field'],
    // },
    {
      name: 'textarea',
      component: FormlyFieldTextArea,
      wrappers: ['form-field'],
    },
  ],
  wrappers: [
    { name: 'form-field', component: FormlyWrapperFormField },
  ],
};
