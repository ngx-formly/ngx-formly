import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-textarea',
  template: `
    <textarea
      class="k-textarea"
      [class.k-state-invalid]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [cols]="to.cols"
      [rows]="to.rows"
    ></textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {}
