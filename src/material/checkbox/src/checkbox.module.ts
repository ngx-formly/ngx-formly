import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormlyFieldCheckbox } from './checkbox.type';
import { FormlyFieldMultiCheckbox } from './multicheckbox.type';

@NgModule({
  declarations: [FormlyFieldCheckbox, FormlyFieldMultiCheckbox],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCheckboxModule,

    FormlyMatFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'checkbox',
          component: FormlyFieldCheckbox,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              hideFieldUnderline: true,
              indeterminate: true,
              floatLabel: 'always',
              hideLabel: true,
              align: 'start', // start or end
            },
          },
        },
        {
          name: 'multicheckbox',
          component: FormlyFieldMultiCheckbox,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              hideFieldUnderline: true,
              floatLabel: 'always',
              options: [],
            },
          },
        },
      ],
    }),
  ],
})
export class FormlyMatCheckboxModule { }
