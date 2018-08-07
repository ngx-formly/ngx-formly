import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-select',
  template: `
  <ion-item>
    <ion-label [position]="to.labelPosition">{{ to.label }}</ion-label>
    <ion-select
      [formControl]="formControl"
      [formlyAttributes]="field"
      [multiple]="to.multiple">
      <ion-select-option *ngFor="let option of to.options | formlySelectOptions:field | async" [value]="option.value">
        {{ option.label }}
      </ion-select-option>
    </ion-select>
  </ion-item>
  `,
})
export class FormlyFieldSelect extends FieldType {}
