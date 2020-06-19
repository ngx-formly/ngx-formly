import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-toggle',
  template: ` <ion-toggle [formControl]="formControl" [ionFormlyAttributes]="field"> </ion-toggle> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldToggle extends FieldType {}
