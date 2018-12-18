import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-radio',
  template: `
    <ion-list>
      <ion-radio-group
        [formControl]="formControl"
        [formlyAttributes]="field"
        (ionChange)="change($event)">
        <ion-list-header>{{ to.label }}</ion-list-header>
        <ion-item *ngFor="let option of to.options | formlySelectOptions:field | async">
          <ion-label>{{ option.label }}</ion-label>
          <ion-radio [value]="option.value"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-list>
    <ion-item lines="none" *ngIf="showError">
      <ion-label>
        <ion-text color="danger">
          <p>
            <formly-validation-message [field]="field"></formly-validation-message>
          </p>
        </ion-text>
      </ion-label>
    </ion-item>
  `,
})
export class FormlyFieldRadio extends FieldType {
  defaultOptions = {
    templateOptions: { options: [] },
  };
}
