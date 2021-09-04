import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-textarea',
  template: `
    <textarea
      [class.ng-dirty]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [cols]="to.cols"
      [rows]="to.rows"
      pInputTextarea
    ></textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {}
