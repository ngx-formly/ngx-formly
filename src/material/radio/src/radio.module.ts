import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

import { FormlyFieldRadio } from './radio.type';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,

    FormlyMatFormFieldModule,
    FormlyModule.forChild({
      types: [{
        name: 'radio',
        component: FormlyFieldRadio,
        wrappers: ['form-field'],
        defaultOptions: {
          templateOptions: {
            hideFieldUnderline: true,
            floatLabel: 'always',
            options: [],
          },
        },
      }],
    }),
  ],
})
export class FormlyMatRadioModule { }
