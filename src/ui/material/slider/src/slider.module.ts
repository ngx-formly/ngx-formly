import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { FormlyFieldSlider } from './slider.type';
import { withFormlyFieldSlider } from './slider.config';

@NgModule({
  declarations: [FormlyFieldSlider],
  imports: [
    CommonModule,
    MatCommonModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatSliderModule,
    FormlyMatFormFieldModule,
    FormlyModule.forChild(withFormlyFieldSlider()),
  ],
})
export class FormlyMatSliderModule {}
