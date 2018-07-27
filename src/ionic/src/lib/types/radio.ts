import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-radio',
  template: `
    <ion-list>
      <ion-radio-group
        [formControl]="formControl"
        [formlyAttributes]="field">
        <ion-list-header>{{ to.label }}</ion-list-header>

        <ion-item *ngFor="let option of to.options | formlySelectOptions:field | async">
          <ion-label>{{ option.label }}</ion-label>
          <ion-radio [value]="option.value"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-list>
  `,
})
export class FormlyFieldRadio extends FieldType {}
