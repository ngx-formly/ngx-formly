import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { FormlyFieldRadio } from './radio.type';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzRadioModule,

    FormlyNzFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'radio',
          component: FormlyFieldRadio,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyNzRadioModule {}
