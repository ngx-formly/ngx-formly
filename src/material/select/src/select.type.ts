import { Component, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-select',
  template: `
    <mat-select [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [compareWith]="to.compareWith || compareWith"
      [multiple]="to.multiple"
      (selectionChange)="change($event)"
      [errorStateMatcher]="errorStateMatcher"
      [aria-labelledby]="formField?._labelId"
      >
      <ng-container *ngFor="let item of to.options | formlySelectOptions:field | async">
        <mat-optgroup *ngIf="item.group" [label]="item.label">
          <mat-option *ngFor="let child of item.group" [value]="child.value" [disabled]="child.disabled">
            {{ child.label }}
          </mat-option>
        </mat-optgroup>
        <mat-option *ngIf="!item.group" [value]="item.value" [disabled]="item.disabled">{{ item.label }}</mat-option>
      </ng-container>
    </mat-select>
  `,
})
export class FormlyFieldSelect extends FieldType {
  @ViewChild(MatSelect) formFieldControl!: MatSelect;

  change($event: MatSelectChange) {
    if (this.to.change) {
      this.to.change(this.field, $event);
    }
  }

  compareWith(o1: any, o2: any) {
    return o1 === o2;
  }
}
