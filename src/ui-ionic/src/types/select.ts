import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-select',
  template: `
  <ion-item>
    <ion-label>{{ to.label }}</ion-label>
    <ion-select
      [formControl]="formControl"
      [formlyAttributes]="field"
      [multiple]="to.multiple">
      <ion-option *ngFor="let option of to.options" [value]="option.value">
        {{ option.label }}
      </ion-option>
    </ion-select>
  </ion-item>
  `,
})
export class FormlyFieldSelect extends FieldType {}
