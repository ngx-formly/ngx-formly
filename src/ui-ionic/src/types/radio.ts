import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-rdgroup',
  template: `
    <ion-list radio-group
      [formControl]="formControl"
      [formlyAttributes]="field">
      <ion-list-header>{{ to.label }}</ion-list-header>

      <ion-item *ngFor="let option of to.options">
        <ion-label>{{ option.label }}</ion-label>
        <ion-radio [value]="option.value"></ion-radio>
      </ion-item>
    </ion-list>
  `,
})
export class FormlyFieldRadio extends FieldType {}
