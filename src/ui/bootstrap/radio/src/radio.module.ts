import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { FormlyBootstrapFormFieldModule } from '@ngx-formly/bootstrap/form-field';
import { FormlyFieldRadio } from './radio.type';
import { withFormlyFieldRadio } from './radio.config';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormlyBootstrapFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldRadio()),
  ],
})
export class FormlyBootstrapRadioModule {}
