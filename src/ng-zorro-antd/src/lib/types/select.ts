import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-select',
  template: `
    <ng-container *ngIf="to.multiple; else singleSelect">
      <nz-select style="width: 100%;" nzMode="multiple" [formControl]="formControl" [formlyAttributes]="field" nzAllowClear>
        <ng-container *ngFor="let item of to.options | formlySelectOptions:field | async">
          <nz-option-group *ngIf="item.group"  [nzLabel]="item.label">
            <nz-option *ngFor="let child of item.group" [nzValue]="child.value" [nzLabel]="child.label" [nzDisabled]="child.disabled">
            </nz-option>
          </nz-option-group>
          <nz-option *ngIf="!item.group" [nzValue]="item.value" [nzLabel]="item.label" [nzDisabled]="item.disabled">
          </nz-option>
        </ng-container>
      </nz-select>
    </ng-container>

    <ng-template #singleSelect>
      <nz-select [formControl]="formControl" [formlyAttributes]="field">
        <ng-container *ngFor="let item of to.options | formlySelectOptions:field | async">
          <nz-option-group *ngIf="item.group"  [nzLabel]="item.label">
            <nz-option *ngFor="let child of item.group" [nzValue]="child.value" [nzLabel]="child.label" [nzDisabled]="child.disabled">
            </nz-option>
          </nz-option-group>
          <nz-option *ngIf="!item.group" [nzValue]="item.value" [nzLabel]="item.label" [nzDisabled]="item.disabled">
          </nz-option>
        </ng-container>
      </nz-select>
    </ng-template>
  `,
})
export class FormlyFieldSelect extends FieldType {}
