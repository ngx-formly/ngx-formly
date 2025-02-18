import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';
import { FormlyFieldDatepicker } from './datepicker.type';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
  declarations: [FormlyFieldDatepicker],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    FormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'datepicker',
          component: FormlyFieldDatepicker,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyDatepickerModule {}
