import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-select',
  template: `
    <ion-select
      [formControl]="formControl"
      [formlyAttributes]="field"
      [multiple]="to.multiple"
      [interface]="to.interface"
      (ionChange)="change($event)">
      <ion-select-option *ngFor="let option of to.options | formlySelectOptions:field | async" [value]="option.value">
        {{ option.label }}
      </ion-select-option>
    </ion-select>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldSelect extends FieldType {
}
