import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-input',
  template: `
    <ion-item>
      <ion-label [position]="to.labelPosition || 'inline'">{{ to.label }}</ion-label>
      <ion-input [type]="to.type || 'text'"
        [formControl]="formControl"
        [formlyAttributes]="field">
      </ion-input>
    </ion-item>
  `,
})
export class FormlyFieldInput extends FieldType {}
