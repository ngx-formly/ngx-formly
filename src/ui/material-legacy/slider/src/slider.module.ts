import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { FormlyMatFormFieldModule } from '@ngx-formly/material-legacy/form-field';

import { FormlyFieldSlider } from './slider.type';

@NgModule({
  declarations: [FormlyFieldSlider],
  imports: [
    CommonModule,
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
