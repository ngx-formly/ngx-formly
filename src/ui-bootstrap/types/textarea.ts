import { Component } from '@angular/core';
import { FieldType } from '../../core/core';

@Component({
  selector: 'formly-field-textarea',
  template: `
    <textarea [id]="id" [name]="key" [formControl]="formControl" [cols]="templateOptions.cols"
      [rows]="templateOptions.rows" class="form-control"
      [formlyAttributes]="field">
    </textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {
}
