import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-toggle',
  template: `
    <ion-toggle
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ionChange)="change($event)">
    </ion-toggle>
  `,
})
export class FormlyFieldToggle extends FieldType {}

