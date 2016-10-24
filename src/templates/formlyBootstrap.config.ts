import {ConfigOption} from '../services/formly.config';
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
];

export const BOOTSTRAP_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: 'input',
      component: FormlyFieldInput,
      wrappers: ['fieldset', 'label', 'description', 'validation-message'],
    },
    {
      name: 'checkbox',
      component: FormlyFieldCheckbox,
      wrappers: ['fieldset', 'description', 'validation-message'],
    },
    {
      name: 'radio',
      component: FormlyFieldRadio,
      wrappers: ['fieldset', 'label', 'description', 'validation-message'],
    },
    {
      name: 'select',
      component: FormlyFieldSelect,
      wrappers: ['fieldset', 'label', 'description', 'validation-message'],
    },
    {
      name: 'textarea',
      component: FormlyFieldTextArea,
      wrappers: ['fieldset', 'label', 'description', 'validation-message'],
    },
    {
      name: 'multicheckbox',
      component: FormlyFieldMultiCheckbox,
      wrappers: ['fieldset', 'label', 'description', 'validation-message'],
    },
  ],
  wrappers: [
    {name: 'label', component: FormlyWrapperLabel},
    {name: 'description', component: FormlyWrapperDescription},
    {name: 'validation-message', component: FormlyWrapperValidationMessages},
    {name: 'fieldset', component: FormlyWrapperFieldset},
  ],
  validationMessages: [
    {name: 'required', message: 'This field is required.'},
    {name: 'invalidEmailAddress', message: 'Invalid Email Address'},
    {name: 'maxlength', message: 'Maximum Length Exceeded.'},
    {name: 'minlength', message: 'Should have atleast 2 Characters'},
  ],
};
