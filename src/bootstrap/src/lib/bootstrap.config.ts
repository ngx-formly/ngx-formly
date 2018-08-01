import { ConfigOption } from '@ngx-formly/core';
import { TemplateAddons } from './run/addon';
import {
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldRadio,
  FormlyFieldSelect,
  FormlyFieldTextArea,
  FormlyFieldMultiCheckbox,
} from './types/types';
import {
  FormlyWrapperAddons,
  FormlyWrapperFormField,
} from './wrappers/wrappers';

export const FIELD_TYPE_COMPONENTS = [
  // types
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldRadio,
  FormlyFieldSelect,
  FormlyFieldTextArea,
  FormlyFieldMultiCheckbox,

  // wrappers
  FormlyWrapperAddons,
  FormlyWrapperFormField,
];

export const BOOTSTRAP_FORMLY_CONFIG: ConfigOption = {
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
      defaultOptions: {
        templateOptions: {
          indeterminate: true,
          hideLabel: true,
        },
      },
    },
    {
      name: 'radio',
      component: FormlyFieldRadio,
      wrappers: ['form-field'],
      defaultOptions: {
        templateOptions: {
          options: [],
        },
      },
    },
    {
      name: 'select',
      component: FormlyFieldSelect,
      wrappers: ['form-field'],
      defaultOptions: {
        templateOptions: {
          options: [],
        },
      },
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
      name: 'multicheckbox',
      component: FormlyFieldMultiCheckbox,
      wrappers: ['form-field'],
      defaultOptions: {
        templateOptions: {
          options: [],
        },
      },
    },
  ],
  wrappers: [
    {name: 'addons', component: FormlyWrapperAddons},
    {name: 'form-field', component: FormlyWrapperFormField},
  ],
  manipulators: [
    {class: TemplateAddons, method: 'run'},
  ],
};
