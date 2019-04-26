import { Component, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-select',
  template: `
    <ng-template #selectAll>
      <mat-option (click)="toggleSelectAll()">
        <mat-pseudo-checkbox class="mat-option-pseudo-checkbox"
          [state]="state">
        </mat-pseudo-checkbox>
        {{ to.selectAllOption }}
      </mat-option>
    </ng-template>

    <mat-select [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [tabindex]="to.tabindex || 0"
      [compareWith]="to.compareWith || compareWith"
      [multiple]="to.multiple"
      (selectionChange)="change($event)"
      [errorStateMatcher]="errorStateMatcher"
      [aria-labelledby]="formField?._labelId"
      [disableOptionCentering]="to.disableOptionCentering"
      >
      <ng-container *ngIf="to.multiple && to.selectAllOption" [ngTemplateOutlet]="selectAll"></ng-container>
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

  defaultOptions = {
    templateOptions: { options: [] },
  };

  get value() { return this.formControl.value || []; }
  get state() {
    if (this.value.length > 0) {
      return this.value.length !== this.formFieldControl.options.length
        ? 'indeterminate'
        : 'checked';
    }

    return '';
  }

  toggleSelectAll() {
    this.formControl.setValue(
      this.value.length !== this.formFieldControl.options.length
        ? this.formFieldControl.options.map(x => x.value)
        : [],
    );
  }

  change($event: MatSelectChange) {
    if (this.to.change) {
      this.to.change(this.field, $event);
    }
  }

  compareWith(o1: any, o2: any) {
    return o1 === o2;
  }
}
