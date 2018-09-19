import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-textarea',
  template: `
    <ion-textarea
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ionChange)="change($event)">
    </ion-textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {}
