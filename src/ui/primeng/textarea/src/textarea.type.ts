import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-textarea',
  template: `
    <textarea
      [formControl]="formControl"
      [formlyAttributes]="field"
      [cols]="to.cols"
      [rows]="to.rows"
      pInputTextarea
    ></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType {}
