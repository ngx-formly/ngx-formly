import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-textarea',
  template: `
    <ion-textarea [formControl]="formControl" [ionFormlyAttributes]="field" [cols]="to.cols" [rows]="to.rows">
    </ion-textarea>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType {}
