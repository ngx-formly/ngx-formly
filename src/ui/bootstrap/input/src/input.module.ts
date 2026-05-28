import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyBootstrapFormFieldModule } from '@ngx-formly/bootstrap/form-field';

import { FormlyFieldInput } from './input.type';
import { withFormlyFieldInput } from './input.config';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormlyBootstrapFormFieldModule,
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
})
export class FormlyBootstrapInputModule {}
