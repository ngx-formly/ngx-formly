import { ConfigOption } from '@ngx-formly/core';
import {
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldRadio,
  FormlyFieldSelect,
  FormlyFieldTextArea,
  FormlyFieldMultiCheckbox,
} from './types/types';
import { FormlyWrapperFormField } from './wrappers/wrappers';

export const FIELD_TYPE_COMPONENTS = [
  // types
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldRadio,
  FormlyFieldSelect,
  FormlyFieldTextArea,
  FormlyFieldMultiCheckbox,

  // wrappers
  FormlyWrapperFormField,
];

export const MATERIAL_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: 'input',
      component: FormlyFieldInput,
      wrappers: ['form-field'],
    },
    {
      name: 'textarea',
      component: FormlyFieldTextArea,
      wrappers: ['form-field'],
      defaultOptions: {
        templateOptions: {
          cols: 1,
          rows: 1,
        },
      },
    },
    {
      name: 'select',
      component: FormlyFieldSelect,
      wrappers: ['form-field'],
    },
    {
      name: 'radio',
      component: FormlyFieldRadio,
      wrappers: ['form-field'],
      defaultOptions: {
        templateOptions: {
          floatLabel: 'always',
        },
      },
    },
    {
      name: 'checkbox',
      component: FormlyFieldCheckbox,
      wrappers: ['form-field'],
      defaultOptions: {
        templateOptions: {
          floatLabel: 'always',
        },
      },
    },
    {
      name: 'multicheckbox',
      component: FormlyFieldMultiCheckbox,
      wrappers: ['form-field'],
      defaultOptions: {
        templateOptions: {
          floatLabel: 'always',
        },
      },
    },
  ],
  wrappers: [
    { name: 'form-field', component: FormlyWrapperFormField },
  ],
  manipulators: [],
};
