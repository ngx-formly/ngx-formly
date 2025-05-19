import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';
import { FormlyFieldDatepicker } from './datepicker.type';
import { withFormlyFieldDatepicker } from './datepicker.config';

@NgModule({
  declarations: [FormlyFieldDatepicker],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,

    FormlyFormFieldModule,
    FormlyModule.forChild(withFormlyFieldDatepicker()),
  ],
})
export class FormlyDatepickerModule {}
