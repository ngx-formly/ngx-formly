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
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldInput extends FieldType {}
