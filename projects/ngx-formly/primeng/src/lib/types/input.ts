import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-input',
  template: `
    <input
      [class.ng-dirty]="showError"
      [type]="to.type || 'text'"
      [formControl]="formControl"
      [formlyAttributes]="field" pInputText />
  `,
})
export class FormlyFieldInput extends FieldType {}
