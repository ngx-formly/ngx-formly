import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-textarea',
  template: `
    <ion-textarea [formControl]="formControl" [ionFormlyAttributes]="field" [cols]="props.cols" [rows]="props.rows">
    </ion-textarea>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig> {}
