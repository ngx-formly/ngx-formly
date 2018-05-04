import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-input',
  template: `
    <input class="k-textbox"
      [class.k-state-invalid]="showError"
      [type]="to.type || 'text'"
      [formControl]="formControl"
      [formlyAttributes]="field" />
  `,
})
export class FormlyFieldInput extends FieldType {}
