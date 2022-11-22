import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';

import { FormlyFieldToggle } from './toggle.type';

@NgModule({
  declarations: [FormlyFieldToggle],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormlyMatFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'toggle',
          component: FormlyFieldToggle,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyMatToggleModule {}
