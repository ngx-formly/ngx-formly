import { Validators } from '@angular/forms';
import { ConfigOption, Field } from '@ngx-formly/core';
import { RepeatComponent } from './types/repeatedSection';
import { FormlyFieldToggle } from './types/toggle';
import { FormlyWrapperHorizontalLabel } from './wrappers/horizontal.wrapper';
import { FormlyPanelWrapper } from './wrappers/panel.wrapper';

export function dateFormatValidator(control) {
  return !control.value || control.value.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
}

export function requiredValidationMessage(err, field) {
  return `${field.templateOptions.label} is required.`;
}

export function minlengthValidationMessage(err, field) {
  return `Should have atleast ${err.requiredLength} characters`;
}

export const NgFormlyConfig: ConfigOption = {
  types: [
    { name: 'toggle', component: FormlyFieldToggle, defaultOptions: { templateOptions: { isAlert: false, isLarge: true }}},
    { name: 'horizontalInput', extends: 'input'},
    { name: 'repeatSection', component: RepeatComponent },
    {
      name: 'dateFormat',
      defaultOptions: {
        templateOptions: {
          placeholder: 'dd/mm/yyyy such as 20/05/2015',
          dateFormat: 'DD, d  MM, yy',
          addonLeft: {
            class: 'fa fa-usd',
          },
        },
        validators: {
          date: dateFormatValidator,
        },
      },
    },
  ],
  validators: [{ name: 'required', validation: Validators.required}],
  validationMessages: [
    { name: 'required', message: requiredValidationMessage },
    { name: 'invalidEmailAddress', message: 'Invalid Email Address' },
    { name: 'maxlength', message: 'Maximum Length Exceeded.' },
    { name: 'minlength', message: minlengthValidationMessage },
    { name: 'not_matching', message: 'Password Not Matching' },
    { name: 'zipCode', message: 'ZIP code should be 5 characters'},
    { name: 'uniqueUsername', message: 'This username is already taken.'},
  ],
  wrappers: [
    { name: 'formly-wrapper-horizontal', component: FormlyWrapperHorizontalLabel, types: ['horizontalInput'] },
    { name: 'panel', component: FormlyPanelWrapper },
  ],
};

export const FORMLY_COMPONENTS = [
  FormlyFieldToggle,
  RepeatComponent,
  FormlyWrapperHorizontalLabel,
  FormlyPanelWrapper,
];
