import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-select',
  template: `
    <nz-select
      [class.ng-dirty]="showError"
      [nzPlaceHolder]="props.placeholder"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [nzMode]="props.multiple ? 'multiple' : 'default'"
      (ngModelChange)="props.change && props.change(field, $event)"
    >
      <ng-container *ngFor="let item of props.options | formlySelectOptions: field | async">
        <nz-option-group *ngIf="item.group" [nzLabel]="item.label">
          <nz-option
            *ngFor="let child of item.group"
            [nzValue]="child.value"
            [nzDisabled]="child.disabled"
            [nzLabel]="child.label"
          >
          </nz-option>
        </nz-option-group>
        <nz-option
          *ngIf="!item.group"
          [nzValue]="item.value"
          [nzDisabled]="item.disabled"
          [nzLabel]="item.label"
        ></nz-option>
      </ng-container>
    </nz-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig> {}
