import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-textarea',
  template: `
    <ion-item>
      <ion-label>{{ to.label }}</ion-label>
      <ion-textarea [formControl]="formControl" [formlyAttributes]="field">
      </ion-textarea>
    </ion-item>
  `,
})
export class FormlyFieldTextArea extends FieldType {}
