import { ConfigOption } from '@ngx-formly/core';
import {
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldDatetime,
  FormlyFieldRadio,
  FormlyFieldToggle,
  FormlyFieldSelect,
  FormlyFieldRange,
  FormlyFieldTextArea,
} from './types/types';
import { FormlyWrapperFormField } from './wrappers/wrappers';


export const FIELD_TYPE_COMPONENTS = [
  // types
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldDatetime,
  FormlyFieldRadio,
  FormlyFieldToggle,
  FormlyFieldSelect,
  FormlyFieldRange,
  FormlyFieldTextArea,

  // wrappers
  FormlyWrapperFormField,
];

export const IONIC_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: 'input',
      component: FormlyFieldInput,
      wrappers: ['form-field'],
    },
    {
      name: 'checkbox',
      component: FormlyFieldCheckbox,
      wrappers: ['form-field'],
    },
    {
      name: 'datetime',
      component: FormlyFieldDatetime,
      wrappers: ['form-field'],
    },
    {
      name: 'radio',
      component: FormlyFieldRadio,
      wrappers: ['form-field'],
    },
    {
      name: 'toggle',
      component: FormlyFieldToggle,
      wrappers: ['form-field'],
    },
    {
      name: 'select',
      component: FormlyFieldSelect,
      wrappers: ['form-field'],
    },
    {
      name: 'range',
      component: FormlyFieldRange,
      wrappers: ['form-field'],
    },
    {
      name: 'textarea',
      component: FormlyFieldTextArea,
      wrappers: ['form-field'],
    },
  ],
  wrappers: [
    { name: 'form-field', component: FormlyWrapperFormField },
  ],
  manipulators: [
  ],
};
