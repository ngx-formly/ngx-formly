import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormlyFieldInput } from './input.type';
import { FormlyFieldTextArea } from './textarea.type';

@NgModule({
  declarations: [FormlyFieldInput, FormlyFieldTextArea],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,

    FormlyMatFormFieldModule,
    FormlyModule.forChild({
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
      ],
    }),
  ],
})
export class FormlyMatInputModule { }
