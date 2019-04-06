import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { useDefaultIfUnset } from '../utils';

@Component({
  selector: 'formly-field-antd-cascader',
  template: `
    <nz-cascader
      [class.ng-dirty]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [nzAllowClear]="nzAllowClear"
      [nzAutoFocus]="nzAutoFocus"
      [nzChangeOn]="nzChangeOn"
      [nzChangeOnSelect]="nzChangeOnSelect"
      [nzColumnClassName]="nzColumnClassName"
      [nzDisabled]="nzDisabled"
      [nzExpandTrigger]="nzExpandTrigger"
      [nzMenuClassName]="nzMenuClassName"
      [nzMenuStyle]="nzMenuStyle"
      [nzNotFoundContent]="nzNotFoundContent"
      [nzLabelProperty]="nzLabelProperty"
      [nzLabelRender]="nzLabelRender"
      [nzLoadData]="nzLoadData"
      [nzOptions]="nzOptions"
      [nzPlaceHolder]="nzPlaceHolder"
      [nzShowArrow]="nzShowArrow"
      [nzShowInput]="nzShowInput"
      [nzShowSearch]="nzShowSearch"
      [nzSize]="nzSize"
      [nzValueProperty]="nzValueProperty"
    >
      <a href="javascript:void(0)" *ngIf="!nzShowInput">{{ to.label }}</a>
    </nz-cascader>
  `,
  styles: [
    `
      nz-select {
        min-width: 10em;
      }
    `,
  ],
})
export class FormlyFieldCascader extends FieldType {
  get nzAllowClear() {
    return useDefaultIfUnset(this.to!.nzAllowClear, true);
  }

  get nzAutoFocus() {
    return useDefaultIfUnset(this.to!.nzAutoFocus, false);
  }

  get nzChangeOn() {
    return this.to!.nzChangeOn;
  }

  get nzChangeOnSelect() {
    return useDefaultIfUnset(this.to!.nzChangeOnSelect, false);
  }

  get nzColumnClassName() {
    return this.to!.nzColumnClassName;
  }

  get nzDisabled() {
    return useDefaultIfUnset(this.to!.nzDisabled, false);
  }

  get nzExpandTrigger() {
    return useDefaultIfUnset(this.to!.nzExpandTrigger, 'click');
  }

  get nzMenuClassName() {
    return this.to!.nzMenuClassName;
  }

  get nzMenuStyle() {
    return this.to!.nzMenuStyle;
  }

  get nzNotFoundContent() {
    return this.to!.nzNotFoundContent;
  }

  get nzLabelProperty() {
    return useDefaultIfUnset(this.to!.nzLabelProperty, 'label');
  }

  get nzLabelRender() {
    return this.to!.nzLabelRender;
  }

  get nzLoadData() {
    return this.to!.nzLoadData;
  }

  get nzOptions() {
    return this.to!.nzOptions;
  }

  get nzPlaceHolder() {
    return this.to!.nzPlaceHolder;
  }

  get nzShowArrow() {
    return useDefaultIfUnset(this.to!.nzShowArrow, true);
  }

  get nzShowInput() {
    return useDefaultIfUnset(this.to!.nzShowInput, true);
  }

  get nzShowSearch() {
    return useDefaultIfUnset(this.to!.nzShowSearch, false);
  }

  get nzSize() {
    return useDefaultIfUnset(this.to!.nzSize, 'default');
  }

  get nzValueProperty() {
    return useDefaultIfUnset(this.to!.nzValueProperty, 'value');
  }
}
