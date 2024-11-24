import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldToggle } from './toggle.type';
import { withFormlyFieldToggle } from './toggle.config';

@NgModule({
  declarations: [FormlyFieldToggle],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldToggle()),
  ],
})
export class FormlyToggleModule {}
