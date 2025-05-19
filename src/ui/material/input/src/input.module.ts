import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormlyFieldInput } from './input.type';
import { withFormlyFieldInput } from './input.config';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,

    FormlyMatFormFieldModule,
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
})
export class FormlyMatInputModule {}
