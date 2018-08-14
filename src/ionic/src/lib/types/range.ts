import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-range',
  template: `
    <ion-range [min]="to.min"
      [max]="to.max"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ionChange)="change($event)">
      <ion-label slot="start">{{ to.min }}</ion-label>
      <ion-label slot="end">{{ to.max }}</ion-label>
    </ion-range>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldRange extends FieldType {}
