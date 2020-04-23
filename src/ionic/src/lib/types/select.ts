import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-select',
  template: `
    <ng-container *ngIf="to.options | formlySelectOptions:field | async; let options">
      <ion-select
        [formControl]="formControl"
        [ionFormlyAttributes]="field"
        [multiple]="to.multiple"
        [interface]="to.interface"
        [okText]="to.okText"
        [cancelText]="to.cancelText">
        <ion-select-option *ngFor="let option of options" [value]="option.value">
            {{ option.label }}
        </ion-select-option>
      </ion-select>
    </ng-container>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldSelect extends FieldType {
  defaultOptions = {
    templateOptions: { options: [] },
  };
}
