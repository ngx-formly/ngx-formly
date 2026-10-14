import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonCheckbox } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldCheckbox } from './checkbox.type';
import { withFormlyFieldCheckbox } from './checkbox.config';

@NgModule({
  declarations: [FormlyFieldCheckbox],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonCheckbox,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldCheckbox()),
  ],
})
export class FormlyCheckboxModule {}
