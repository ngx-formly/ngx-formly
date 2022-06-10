import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';
import { FormlyFieldDatepicker } from './datepicker.type';

@NgModule({
  declarations: [FormlyFieldDatepicker],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,

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
