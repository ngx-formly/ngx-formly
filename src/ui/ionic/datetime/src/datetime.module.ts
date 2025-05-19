import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldDatetime } from './datetime.type';
import { withFormlyFieldDatetime } from './datetime.config';

@NgModule({
  declarations: [FormlyFieldDatetime],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldDatetime()),
  ],
})
export class FormlyDatetimeModule {}
