import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-textarea',
  template: `
    <textarea
      [class.ng-dirty]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field" nzInput></textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {}
