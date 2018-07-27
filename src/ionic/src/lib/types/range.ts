import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-range',
  template: `
    <ion-list>
      <ion-list-header>{{ to.label }}</ion-list-header>
      <ion-item>
        <ion-range [min]="to.min"
          [max]="to.max"
          [formControl]="formControl"
          [formlyAttributes]="field">
          <ion-label slot="start">{{ to.min }}</ion-label>
          <ion-label slot="end">{{ to.max }}</ion-label>
      </ion-range>
      </ion-item>
    </ion-list>
  `,
})
export class FormlyFieldRange extends FieldType {}
