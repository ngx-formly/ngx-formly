import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-textarea',
  template: `
    <textarea row="4" nz-input
      [class.k-state-invalid]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"></textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {}
