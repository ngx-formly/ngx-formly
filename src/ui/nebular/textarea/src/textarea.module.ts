import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbInputModule } from '@nebular/theme';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyNebularFormFieldModule } from '@ngx-formly/nebular/form-field';
import { FormlyFieldTextArea } from './textarea.type';

@NgModule({
  declarations: [FormlyFieldTextArea],
  imports: [
    CommonModule,
    FormlyNebularFormFieldModule,
    ReactiveFormsModule,
    NbInputModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'textarea',
          component: FormlyFieldTextArea,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyNebularTextareaModule {}
