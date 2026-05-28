import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldSlider } from './slider.type';
import { withFormlyFieldSlider } from './slider.config';

@NgModule({
  declarations: [FormlyFieldSlider],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldSlider()),
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormlySliderModule {}
