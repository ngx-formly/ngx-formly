import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

import { FormlySliderTypeComponent } from './slider.type';

@NgModule({
  declarations: [FormlySliderTypeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    FormlyModule.forChild({
      types: [{
        name: 'slider',
        component: FormlySliderTypeComponent,
        wrappers: ['form-field'],
        defaultOptions: {
          templateOptions: {
            hideFieldUnderline: true,
            floatLabel: 'always',
            hideLabel: true,
          },
        },
      }],
    }),
  ],
})
export class FormlyMatSliderModule { }
