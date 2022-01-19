import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-checkbox',
  template: ` <ion-checkbox [formControl]="formControl" [ionFormlyAttributes]="field"> </ion-checkbox> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {}
