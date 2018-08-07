import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-checkbox',
  template: `
    <ion-item>
      <ion-label [position]="to.labelPosition">{{ to.label }}</ion-label>
      <ion-checkbox
        [formControl]="formControl"
        [formlyAttributes]="field">
      </ion-checkbox>
    </ion-item>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
}
