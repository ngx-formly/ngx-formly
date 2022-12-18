import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { VERSION } from '@angular/cdk';

import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { FormlyFieldSlider as LegacyFormlyFieldSlider } from './slider.type';
import { FormlyFieldMDCSlider } from './slider-mdc.type';
import { MatSliderThumb } from './slider-input';
const FormlyFieldSlider = Number(VERSION.major) >= 15 ? FormlyFieldMDCSlider : LegacyFormlyFieldSlider;

@NgModule({
  declarations: [LegacyFormlyFieldSlider, FormlyFieldMDCSlider, MatSliderThumb],
  imports: [
    CommonModule,
    MatCommonModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatSliderModule,
    FormlyMatFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'slider',
          component: FormlyFieldSlider,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyMatSliderModule {}
