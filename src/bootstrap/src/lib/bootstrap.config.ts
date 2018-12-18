import { ConfigOption } from '@ngx-formly/core';
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
import { addonsExtension } from './extension/addon';

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
    },
    {
      name: 'radio',
      component: FormlyFieldRadio,
      wrappers: ['form-field'],
    },
    {
      name: 'select',
      component: FormlyFieldSelect,
      wrappers: ['form-field'],
    },
    {
      name: 'textarea',
      component: FormlyFieldTextArea,
      wrappers: ['form-field'],
    },
    {
      name: 'multicheckbox',
      component: FormlyFieldMultiCheckbox,
      wrappers: ['form-field'],
    },
  ],
  wrappers: [
    {name: 'addons', component: FormlyWrapperAddons},
    {name: 'form-field', component: FormlyWrapperFormField},
  ],
  extensions: [
    { name: 'addons', extension: { onPopulate: addonsExtension } },
  ],
};
