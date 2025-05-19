import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormlyFieldInput } from './input.type';
import { withFormlyFieldInput } from './input.config';

@NgModule({
  declarations: [FormlyFieldInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyFormFieldModule,
    InputsModule,
    FormlyModule.forChild(withFormlyFieldInput()),
  ],
})
export class FormlyInputModule {}
