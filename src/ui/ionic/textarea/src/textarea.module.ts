import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { IonTextarea } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';
import { FormlyFieldTextArea } from './textarea.type';
import { withFormlyFieldTextArea } from './textarea.config';

@NgModule({
  declarations: [FormlyFieldTextArea],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonTextarea,

    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldTextArea()),
  ],
})
export class FormlyTextAreaModule {}
