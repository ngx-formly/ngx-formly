import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

import { FormlyFieldRadio } from './radio.type';
import { withFormlyFieldRadio } from './radio.config';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,

    FormlyMatFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldRadio()),
  ],
})
export class FormlyMatRadioModule {}
