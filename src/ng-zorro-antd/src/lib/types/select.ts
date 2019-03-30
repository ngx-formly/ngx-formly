import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { NzOptionComponent } from 'ng-zorro-antd';
import { useDefaultIfUnset } from '../utils';

@Component({
  selector: 'formly-field-antd-select',
  template: `
    <nz-select
      [class.ng-dirty]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [ngModel]="formControl.value"
      [compareWith]="compareWith"
      [nzAutoClearSearchValue]="nzAutoClearSearchValue"
      [nzAllowClear]="nzAllowClear"
      [nzOpen]="nzOpen"
      [nzAutoFocus]="nzAutoFocus"
      [nzDisabled]="nzDisabled"
      [nzDropdownClassName]="nzDropdownClassName"
      [nzDropdownMatchSelectWidth]="nzDropdownMatchSelectWidth"
      [nzDropdownStyle]="nzDropdownStyle"
      [nzServerSearch]="nzServerSearch"
      [nzFilterOption]="nzFilterOption"
      [nzMaxMultipleCount]="nzMaxMultipleCount"
      [nzMode]="nzMode"
      [nzNotFoundContent]="nzNotFoundContent"
      [nzPlaceHolder]="nzPlaceHolder"
      [nzShowArrow]="nzShowArrow"
      [nzShowSearch]="nzShowSearch"
      [nzSize]="nzSize"
      [nzSuffixIcon]="nzSuffixIcon"
      [nzRemoveIcon]="nzRemoveIcon"
      [nzClearIcon]="nzClearIcon"
      [nzMenuItemSelectedIcon]="nzMenuItemSelectedIcon"
      [nzTokenSeparators]="nzTokenSeparators"
      [nzLoading]="nzLoading"
      [nzMaxTagCount]="nzMaxTagCount"
      [nzMaxTagPlaceholder]="nzMaxTagPlaceholder"
    >
      <nz-option
        *ngFor="let option of to.options | formlySelectOptions: field | async"
        [nzLabel]="option.label"
        [nzValue]="option.value"
        [nzCustomContent]="nzCustomContent"
      ></nz-option>
    </nz-select>
  `,
  styles: [
    `nz-select {
      min-width: 10em;
    }`,
  ],
})
export class FormlyFieldSelect extends FieldType {
  defaultCompareFn = (o1, o2) => o1 === o2;
  defaultFilterFn = (input: string, component: NzOptionComponent) => true;

  get compareWith() {
    return this.to!.compareWith || this.defaultCompareFn;
  }

  get nzAutoClearSearchValue() {
    return this.to!.nzAutoClearSearchValue || false;
  }

  get nzAllowClear() {
    return useDefaultIfUnset(this.to!.nzAllowClear, true);
  }

  get nzOpen() {
    return this.to!.nzOpen || false;
  }

  get nzAutoFocus() {
    return this.to!.nzAutoFocus || false;
  }

  get nzDisabled() {
    return this.to!.nzDisabled || false;
  }

  get nzDropdownClassName() {
    return this.to!.nzDropdownClassName;
  }

  get nzDropdownMatchSelectWidth() {
    return this.to!.nzDropdownMatchSelectWidth || true;
  }

  get nzDropdownStyle() {
    return this.to!.nzDropdownStyle;
  }

  get nzServerSearch() {
    return this.to!.nzServerSearch || false;
  }

  get nzFilterOption() {
    return this.to!.nzFilterOption || this.defaultFilterFn;
  }

  get nzMaxMultipleCount() {
    return this.to!.nzMaxMultipleCount || Infinity;
  }

  get nzMode() {
    return this.to!.nzMode || 'default';
  }

  get nzNotFoundContent() {
    return this.to!.nzNotFoundContent || '';
  }

  get nzPlaceHolder() {
    return this.to!.nzPlaceHolder;
  }

  get nzShowArrow() {
    return useDefaultIfUnset(this.to!.nzShowArrow, true);
  }

  get nzShowSearch() {
    return this.to!.nzShowSearch || false;
  }

  get nzSize() {
    return this.to!.nzSize || 'default';
  }

  get nzSuffixIcon() {
    return this.to!.nzSuffixIcon || '';
  }

  get nzRemoveIcon() {
    return this.to!.nzRemoveIcon || '';
  }

  get nzClearIcon() {
    return this.to!.nzClearIcon || '';
  }

  get nzMenuItemSelectedIcon() {
    return this.to!.nzMenuItemSelectedIcon || '';
  }

  get nzTokenSeparators() {
    return this.to!.nzTokenSeparators || [];
  }

  get nzLoading() {
    return this.to!.nzLoading || false;
  }

  get nzMaxTagCount() {
    return this.to!.nzMaxTagCount || void 0;
  }

  get nzMaxTagPlaceholder() {
    return this.to!.nzMaxTagPlaceholder;
  }

  get nzCustomContent() {
    return useDefaultIfUnset(this.to!.nzCustomContent, false);
  }
}
