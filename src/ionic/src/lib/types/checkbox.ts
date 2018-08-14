import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-checkbox',
  template: `
    <ion-checkbox
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ionChange)="change($event)">
    </ion-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
}
