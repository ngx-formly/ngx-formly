import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-antd-radio',
  template: `
    <nz-radio-group
      [nzName]="nzName"
      [nzSize]="nzSize"
      [nzButtonStyle]="nzButtonStyle"
      [ngModel]="nzValue"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
      <ng-container *ngIf="!nzButtonStyle; else radioBtn">
        <label
          nz-radio
          *ngFor="let option of to.options | formlySelectOptions: field | async"
          [class.ng-dirty]="showError"
          [nzValue]="option.value"
          [nzAutoFocus]="nzAutoFocus"
          [nzDisabled]="nzDisabled"
        >
          {{ option.label }}
        </label>
      </ng-container>

      <ng-template #radioBtn>
        <label
          nz-radio-button
          *ngFor="let option of to.options | formlySelectOptions: field | async"
          [class.ng-dirty]="showError"
          [nzValue]="option.value"
          [nzAutoFocus]="nzAutoFocus"
          [nzDisabled]="nzDisabled"
        >
          {{ option.label }}
        </label>
      </ng-template>
    </nz-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType {
  get nzAutoFocus(): boolean {
    return this.to!.nzAutoFocus || false;
  }

  get nzDisabled(): boolean {
    return this.to!.nzDisabled || false;
  }

  get nzSize() {
    return this.to!.nzSize || 'default';
  }

  get nzName() {
    return this.to!.nzName || void 0;
  }

  get nzButtonStyle(): string {
    return this.to!.nzButtonStyle || void 0;
  }

  get nzRequired(): boolean {
    return this.to!.nzRequired || false;
  }

  get nzValue() {
    return this.to!.nzValue;
  }
}
