import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonRange, IonLabel } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldSlider } from './slider.type';
import { withFormlyFieldSlider } from './slider.config';

@NgModule({
  declarations: [FormlyFieldSlider],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonRange,
    IonLabel,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldSlider()),
  ],
})
export class FormlySliderModule {}
