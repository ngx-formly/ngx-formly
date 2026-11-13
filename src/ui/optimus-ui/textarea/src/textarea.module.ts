import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { FormlyFormFieldModule } from '@ngx-formly/optimus-ui/form-field';
import { FormlyFieldTextArea } from './textarea.type';
import { withFormlyFieldTextArea } from './textarea.config';

@NgModule({
  declarations: [FormlyFieldTextArea],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextareaModule,

    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldTextArea()),
  ],
})
export class FormlyTextAreaModule {}
