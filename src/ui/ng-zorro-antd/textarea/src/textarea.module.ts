import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzInputModule } from 'ng-zorro-antd/input';

import { FormlyFieldTextArea } from './textarea.type';
import { withFormlyFieldTextArea } from './textarea.config';

@NgModule({
  declarations: [FormlyFieldTextArea],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,

    FormlyNzFormFieldModule,
    FormlyModule.forChild(withFormlyFieldTextArea()),
  ],
})
export class FormlyNzTextAreaModule {}
