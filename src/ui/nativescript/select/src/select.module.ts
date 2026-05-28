import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from '@nativescript/angular';

import { FormlyNsFormFieldModule } from '@ngx-formly/nativescript/form-field';
import { FormlyFieldSelect } from './select.type';
import { withFormlyFieldSelect } from './select.config';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,

    FormlyNsFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldSelect()),
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlyNsSelectFieldModule {}
