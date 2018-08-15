import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-input',
  template: `
    <input
      nz-input
      [type]="to.type || 'text'"
      [formControl]="formControl"
      [formlyAttributes]="field" />
  `,
})
export class FormlyFieldInput extends FieldType {}
