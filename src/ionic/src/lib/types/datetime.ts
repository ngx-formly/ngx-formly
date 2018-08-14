import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-datetime',
  template: `
    <ion-datetime
      [displayFormat]="to.displayFormat"
      [pickerFormat]="to.pickerFormat"
      [min]="to.min"
      [max]="to.max"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ionChange)="change($event)">
    </ion-datetime>
  `,
})
export class FormlyFieldDatetime extends FieldType {
}
