import { Component } from '@angular/core';
import { FormlyFieldInput } from './input';

@Component({
  selector: 'formly-field-mat-textarea',
  template: `
    <textarea matInput [name]="key" [formControl]="formControl" [errorStateMatcher]="errorStateMatcher" [cols]="to.cols"
      [rows]="to.rows" [formlyAttributes]="field">
    </textarea>
  `,
})
export class FormlyFieldTextArea extends FormlyFieldInput {
}
