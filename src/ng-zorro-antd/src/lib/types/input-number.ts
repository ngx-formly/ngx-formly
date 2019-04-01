import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

import { useDefaultIfUnset, useExist } from '../utils';

@Component({
  selector: 'formly-field-antd-input-number',
  template: `
    <nz-input-number
      [formControl]="formControl"
      [formlyAttributes]="field"
      [class.ng-dirty]="showError"
      [nzAutoFocus]="nzAutoFocus"
      [nzDisabled]="nzDisabled"
      [nzMax]="nzMax"
      [nzMin]="nzMin"
      [nzFormatter]="nzFormatter"
      [nzParser]="nzParser"
      [nzPrecision]="nzPrecision"
      [nzSize]="nzSize"
      [nzStep]="nzStep"
      [nzPlaceHolder]="nzPlaceHolder"
    ></nz-input-number>
  `,
})
export class FormlyFieldInputNumber extends FieldType {
  defaultFormatter = v => v;

  get nzAutoFocus() {
    return useDefaultIfUnset(this.to!.nzAutoFocus, false);
  }

  get nzDisabled() {
    return this.to!.nzDisabled || false;
  }

  get nzFormatter() {
    return this.to!.nzFormatter || this.defaultFormatter;
  }

  get nzParser() {
    return this.to!.nzParser || this.defaultFormatter;
  }

  get nzPrecision() {
    return this.to!.nzPrecision;
  }

  get nzStep() {
    return useDefaultIfUnset(this.to!.nzStep, 1);
  }

  get nzPlaceHolder() {
    return useDefaultIfUnset(this.to!.nzPlaceHolder, '');
  }

  get nzSize() {
    return this.to!.nzSize || 'default';
  }

  get nzMax() {
    return useDefaultIfUnset(useExist(this.to!.nzMax, this.to!.max), Infinity);
  }

  get nzMin() {
    return useDefaultIfUnset(useExist(this.to!.nzMin, this.to!.min), -Infinity);
  }
}
