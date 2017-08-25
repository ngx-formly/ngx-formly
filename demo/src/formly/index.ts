import { Validators } from '@angular/forms';
import { ConfigOption, Field } from '@ngx-formly/core';
import { RepeatComponent } from './types/repeatedSection';
import { FormlyFieldToggle } from './types/toggle';
import { FormlyWrapperHorizontalLabel } from './wrappers/horizontal.wrapper';
import { FormlyPanelWrapper } from './wrappers/panel.wrapper';

export const NgFormlyConfig: ConfigOption = {
  types: [
    { name: 'toggle', component: FormlyFieldToggle, defaultOptions: { templateOptions: { isAlert: false, isLarge: true }}},
    { name: 'horizontalInput', extends: 'input'},
    { name: 'repeatSection', component: RepeatComponent },
    { name: 'dateFormat', defaultOptions: { templateOptions: {
      placeholder: 'dd/mm/yyyy such as 20/05/2015',
      dateFormat: 'DD, d  MM, yy',
      addonLeft: {
        class: 'fa fa-usd',
      },
    },
    validators: {
      date: control => !control.value || control.value.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) },
    },
  }],
  validators: [{ name: 'required', validation: Validators.required}],
  validationMessages: [
    { name: 'required', message: (err, field) => `${field.templateOptions.label} is required.`},
    { name: 'invalidEmailAddress', message: 'Invalid Email Address' },
    { name: 'maxlength', message: 'Maximum Length Exceeded.' },
    { name: 'minlength', message: (err) => {
        return `Should have atleast ${err.requiredLength} Characters`;
      },
    },
    { name: 'not_matching', message: 'Password Not Matching' },
    { name: 'zipCode', message: 'ZIP code should be 5 characters'},
    { name: 'uniqueUsername', message: 'This username is already taken.'},
  ],
  wrappers: [
    { name: 'formly-wrapper-horizontal', component: FormlyWrapperHorizontalLabel, types: ['horizontalInput'] },
    { name: 'panel', component: FormlyPanelWrapper },
  ],
  extras: {
    showError: (field: Field) => {
      return (field.formState.submitted || field.formControl.touched) && !field.formControl.valid;
    },
  },
};

export const FORMLY_COMPONENTS = [
  FormlyFieldToggle,
  RepeatComponent,
  FormlyWrapperHorizontalLabel,
  FormlyPanelWrapper,
];
