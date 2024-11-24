import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { FormlyFieldSelect } from './select.type';
import { withFormlyFieldSelect } from './select.config';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzSelectModule,

    FormlyNzFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldSelect()),
  ],
})
export class FormlyNzSelectModule {}
