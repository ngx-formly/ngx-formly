import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { IonSelect, IonSelectOption } from '@ionic/angular';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';

import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';
import { FormlyFieldSelect } from './select.type';
import { withFormlyFieldSelect } from './select.config';

@NgModule({
  declarations: [FormlyFieldSelect],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,

    FormlyFormFieldModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild(withFormlyFieldSelect()),
  ],
})
export class FormlySelectModule {}
