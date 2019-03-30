import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-antd-checkbox',
  template: `
    <label
      nz-checkbox
      [class.ng-dirty]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [nzAutoFocus]="nzAutoFocus"
      [nzDisabled]="nzDisabled"
      [nzIndeterminate]="nzIndeterminate"
    >
      {{ to.label }}
    </label>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  get nzAutoFocus(): boolean {
    return this.to!.nzAutoFocus || false;
  }

  get nzDisabled(): boolean {
    return this.to!.nzDisabled || false;
  }

  get nzIndeterminate(): boolean {
    return this.to!.nzIndeterminate || false;
  }
}
