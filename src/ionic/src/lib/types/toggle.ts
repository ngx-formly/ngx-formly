import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-toggle',
  template: `
    <ion-item>
      <ion-label>{{ to.label }}</ion-label>
      <ion-toggle [formControl]="formControl" [formlyAttributes]="field">
      </ion-toggle>
    </ion-item>
  `,
})
export class FormlyFieldToggle extends FieldType {}

