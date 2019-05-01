import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

import { FormlyFieldSlider } from './slider.type';

@NgModule({
  declarations: [FormlyFieldSlider],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        { name: 'slider', component: FormlyFieldSlider, wrappers: ['form-field'] },
        { name: 'range', extends: 'slider' },
      ],
    }),
  ],
})
export class FormlySliderModule { }
