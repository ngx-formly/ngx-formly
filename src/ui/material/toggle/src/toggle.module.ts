import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';

import { FormlyFieldToggle } from './toggle.type';
import { withFormlyFieldToggle } from './toggle.config';

@NgModule({
  declarations: [FormlyFieldToggle],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormlyMatFormFieldModule,
    FormlyModule.forChild(withFormlyFieldToggle()),
  ],
})
export class FormlyMatToggleModule {}
