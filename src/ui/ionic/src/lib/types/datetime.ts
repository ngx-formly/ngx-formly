import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-datetime',
  template: `
    <ion-datetime
      [cancelText]="to.cancelText"
      [dayNames]="to.dayNames"
      [dayShortNames]="to.dayShortNames"
      [dayValues]="to.dayValues"
      [displayFormat]="to.displayFormat"
      [doneText]="to.doneText"
      [hourValues]="to.hourValues"
      [minuteValues]="to.minuteValues"
      [monthNames]="to.monthNames"
      [monthShortNames]="to.monthShortNames"
      [monthValues]="to.monthValues"
      [pickerFormat]="to.pickerFormat"
      [pickerOptions]="to.pickerOptions"
      [yearValues]="to.yearValues"
      [min]="to.minDate ? to.minDate : to.min"
      [max]="to.maxDate ? to.maxDate : to.max"
      [formControl]="formControl"
      [ionFormlyAttributes]="field">
    </ion-datetime>
  `,
})
export class FormlyFieldDatetime extends FieldType {
}
