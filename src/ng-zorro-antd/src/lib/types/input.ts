import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-antd-input',
  template: `
    <ng-container *ngIf="isSimpleInput else groupInput" [ngTemplateOutlet]="simpleInput"></ng-container>

    <ng-template #groupInput>
      <nz-input-group
        [nzAddOnAfter]="nzAddOnAfter"
        [nzAddOnBefore]="nzAddOnBefore"
        [nzPrefix]="nzPrefix"
        [nzSuffix]="nzSuffix"
        [nzCompact]="nzCompact"
        [nzSearch]="nzSearch"
        [nzSize]="nzSize"
      >
        <ng-container [ngTemplateOutlet]="simpleInput"></ng-container>
      </nz-input-group>
    </ng-template>

    <ng-template #simpleInput>
      <input
        nz-input
        [type]="to.type || 'text'"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [class.ng-dirty]="showError"
        [nzSize]="nzSize"
      />
    </ng-template>
  `,
})
export class FormlyFieldInput extends FieldType {
  get isSimpleInput(): boolean {
    return !this.nzAddOnAfter && !this.nzAddOnBefore && !this.nzPrefix && !this.nzSuffix && !this.nzSearch && !this.nzCompact;
  }

  get nzSize() {
    return this.to!.nzSize || 'default';
  }

  get nzAddOnAfter() {
    return this.to!.nzAddOnAfter || void 0;
  }

  get nzAddOnBefore() {
    return this.to!.nzAddOnBefore || void 0;
  }

  get nzPrefix() {
    return this.to!.nzPrefix || void 0;
  }

  get nzSuffix() {
    return this.to!.nzSuffix || void 0;
  }

  get nzCompact() {
    return this.to!.nzCompact || false;
  }

  get nzSearch() {
    return this.to!.nzSearch || false;
  }
}
