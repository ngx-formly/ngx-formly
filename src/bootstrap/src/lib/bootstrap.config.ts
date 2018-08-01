import { ConfigOption } from '@ngx-formly/core';
import { FormlyWrapperAddons } from './wrappers/addons';
import { TemplateDescription } from './run/description';
import { TemplateValidation } from './run/validation';
import { TemplateAddons } from './run/addon';
import { TemplateFieldset } from './run/fieldset';
import {
  FormlyFieldInput,
  FormlyFieldCheckbox,
  FormlyFieldRadio,
  FormlyFieldSelect,
  FormlyFieldTextArea,
  FormlyFieldMultiCheckbox,
} from './types/types';
import {
  FormlyWrapperLabel,
  FormlyWrapperDescription,
  FormlyWrapperValidationMessages,
  FormlyWrapperFieldset,
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
  FormlyWrapperLabel,
  FormlyWrapperDescription,
  FormlyWrapperValidationMessages,
  FormlyWrapperFieldset,
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
    {name: 'label', component: FormlyWrapperLabel},
    {name: 'description', component: FormlyWrapperDescription},
    {name: 'validation-message', component: FormlyWrapperValidationMessages},
    {name: 'fieldset', component: FormlyWrapperFieldset},
    {name: 'addons', component: FormlyWrapperAddons},
    {name: 'form-field', component: FormlyWrapperFormField},
  ],
  manipulators: [
    {class: TemplateDescription, method: 'run'},
    {class: TemplateValidation, method: 'run'},
    {class: TemplateAddons, method: 'run'},
    {class: TemplateFieldset, method: 'run'},
  ],
};
