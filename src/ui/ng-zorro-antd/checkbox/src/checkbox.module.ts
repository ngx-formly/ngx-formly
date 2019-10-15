import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { FormlyFieldCheckbox } from './checkbox.type';

@NgModule({
  declarations: [FormlyFieldCheckbox],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzCheckboxModule,

    FormlyNzFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'checkbox',
          component: FormlyFieldCheckbox,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyNzCheckboxModule {}
