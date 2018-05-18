import { Component, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FieldType } from './field';

@Component({
  selector: 'formly-field-mat-select',
  template: `
    <mat-select [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [multiple]="to.multiple"
      (selectionChange)="change($event)"
      [errorStateMatcher]="errorStateMatcher">
      <ng-container *ngFor="let item of to.options | formlySelectOptions:groupProp | async">
        <mat-optgroup *ngIf="item.group" [label]="item.label">
          <mat-option *ngFor="let child of item.group" [value]="child[valueProp]" [disabled]="child.disabled">
            {{ child[labelProp] }}
          </mat-option>
        </mat-optgroup>
        <mat-option *ngIf="!item.group" [value]="item[valueProp]" [disabled]="item.disabled">{{ item[labelProp] }}</mat-option>
      </ng-container>
    </mat-select>
  `,
})
export class FormlyFieldSelect extends FieldType {
  @ViewChild(MatSelect) formFieldControl: MatSelect;

  get labelProp(): string { return this.to.labelProp || 'label'; }
  get valueProp(): string { return this.to.valueProp || 'value'; }
  get groupProp(): string { return this.to.groupProp || 'group'; }

  change($event: MatSelectChange) {
    if (this.to.change) {
      this.to.change(this.field, $event);
    }
  }
}
