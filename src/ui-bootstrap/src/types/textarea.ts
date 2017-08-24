import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-textarea',
  template: `
    <textarea [name]="key" [formControl]="formControl" [cols]="to.cols"
      [rows]="to.rows" class="form-control"
      [formlyAttributes]="field">
    </textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {
}
