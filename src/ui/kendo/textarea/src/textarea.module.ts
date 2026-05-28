import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormlyFieldTextArea } from './textarea.type';
import { withFormlyFieldTextArea } from './textarea.config';

@NgModule({
  declarations: [FormlyFieldTextArea],
  imports: [
    CommonModule,
    InputsModule,
    ReactiveFormsModule,

    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldTextArea()),
  ],
})
export class FormlyTextAreaModule {}
