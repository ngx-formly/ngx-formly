import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-datetime',
  template: `
    <ion-datetime
      [displayFormat]="to.displayFormat"
      [pickerFormat]="to.pickerFormat"
      [min]="to.min"
      [max]="to.max"
      [formControl]="formControl"
      [ionFormlyAttributes]="field">
    </ion-datetime>
  `,
})
export class FormlyFieldDatetime extends FieldType {
}
