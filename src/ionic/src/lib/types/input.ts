import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-input',
  template: `
    <ion-input [type]="to.type || 'text'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ionChange)="change($event)">
    </ion-input>
  `,
})
export class FormlyFieldInput extends FieldType {}
