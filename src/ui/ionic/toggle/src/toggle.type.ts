import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-toggle',
  template: `
    <ion-toggle [formControl]="formControl" [ionFormlyAttributes]="field"> </ion-toggle>
  `,
})
export class FormlyFieldToggle extends FieldType {}
