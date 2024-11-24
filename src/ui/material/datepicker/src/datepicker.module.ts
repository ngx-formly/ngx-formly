import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FormlyFieldDatepicker } from './datepicker.type';
import { withFormlyFieldDatepicker } from './datepicker.config';

@NgModule({
  declarations: [FormlyFieldDatepicker],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,

    FormlyMatFormFieldModule,
    FormlyModule.forChild(withFormlyFieldDatepicker()),
  ],
})
export class FormlyMatDatepickerModule {}
