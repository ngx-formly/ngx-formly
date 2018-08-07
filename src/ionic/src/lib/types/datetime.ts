import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-datetime',
  template: `
    <ion-item>
      <ion-label [position]="to.labelPosition">{{ to.label }}</ion-label>
      <ion-datetime
        [displayFormat]="to.displayFormat"
        [pickerFormat]="to.pickerFormat"
        [min]="to.min"
        [max]="to.max"
        [formControl]="formControl"
        [formlyAttributes]="field">
      </ion-datetime>
    </ion-item>
  `,
})
export class FormlyFieldDatetime extends FieldType {
}
