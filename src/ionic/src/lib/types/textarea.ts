import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-textarea',
  template: `
    <ion-textarea
      [formControl]="formControl"
      [formlyAttributes]="field"
      [cols]="to.cols"
      [rows]="to.rows"
      (ionChange)="change($event)">
    </ion-textarea>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldTextArea extends FieldType {}
