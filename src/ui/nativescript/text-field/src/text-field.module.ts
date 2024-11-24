import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from '@nativescript/angular';

import { FormlyNsFormFieldModule } from '@ngx-formly/nativescript/form-field';
import { FormlyFieldInput } from './text-field.type';
import { withFormlyFieldInput } from './text-field.config';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,

    FormlyNsFormFieldModule,
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlyNsTextFieldModule {}
