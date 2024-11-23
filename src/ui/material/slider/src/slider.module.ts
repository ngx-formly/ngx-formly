import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { FormlyFieldSlider } from './slider.type';

@NgModule({
  declarations: [FormlyFieldSlider],
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
