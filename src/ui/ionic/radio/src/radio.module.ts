import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonList, IonListHeader, IonRadioGroup, IonItem, IonRadio } from '@ionic/angular';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';
import { FormlyFieldRadio } from './radio.type';
import { withFormlyFieldRadio } from './radio.config';

@NgModule({
  declarations: [FormlyFieldRadio],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonList,
    IonListHeader,
    IonRadioGroup,
    IonItem,
    IonRadio,

    FormlyFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild(withFormlyFieldRadio()),
  ],
})
export class FormlyRadioModule {}
