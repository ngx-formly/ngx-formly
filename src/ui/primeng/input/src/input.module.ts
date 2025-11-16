import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';

import { FormlyFieldInput } from './input.type';
import { withFormlyFieldInput } from './input.config';
import { FormlyInputNumberDirective } from './formly-input-number.directive';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FormlyFormFieldModule,
    FormlyInputNumberDirective,
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
})
export class FormlyInputModule {}
