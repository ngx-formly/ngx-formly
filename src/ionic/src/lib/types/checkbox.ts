import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-checkbox',
  template: `
    <ion-checkbox
      [formControl]="formControl"
      [ionFormlyAttributes]="field">
    </ion-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
}
