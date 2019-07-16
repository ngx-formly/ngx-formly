import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-select',
  template: `
    <ion-select
      [formControl]="formControl"
      [ionFormlyAttributes]="field"
      [multiple]="to.multiple"
      [interface]="to.interface">
      <ion-select-option *ngFor="let option of to.options | formlySelectOptions:field | async" [value]="option.value">
        {{ option.label }}
      </ion-select-option>
    </ion-select>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldSelect extends FieldType {
  defaultOptions = {
    templateOptions: { options: [] },
  };
}
