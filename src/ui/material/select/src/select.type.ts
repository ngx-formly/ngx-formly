import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-select',
  template: `
    <ng-template #selectAll let-selectOptions="selectOptions">
      <mat-option (click)="toggleSelectAll(selectOptions)">
        <mat-pseudo-checkbox class="mat-option-pseudo-checkbox" [state]="getSelectAllState(selectOptions)">
        </mat-pseudo-checkbox>
        {{ to.selectAllOption }}
      </mat-option>
    </ng-template>

    <mat-select
      [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [tabIndex]="to.tabindex"
      [required]="to.required"
      [compareWith]="to.compareWith"
      [multiple]="to.multiple"
      (selectionChange)="change($event)"
      [errorStateMatcher]="errorStateMatcher"
      [aria-label]="_getAriaLabel()"
      [aria-labelledby]="_getAriaLabelledby()"
      [disableOptionCentering]="to.disableOptionCentering"
      [typeaheadDebounceInterval]="to.typeaheadDebounceInterval"
    >
      <ng-container *ngIf="to.options | formlySelectOptions: field | async as selectOptions">
        <ng-container
          *ngIf="to.multiple && to.selectAllOption"
          [ngTemplateOutlet]="selectAll"
          [ngTemplateOutletContext]="{ selectOptions: selectOptions }"
        >
        </ng-container>
        <ng-container *ngFor="let item of selectOptions">
          <mat-optgroup *ngIf="item.group" [label]="item.label">
            <mat-option *ngFor="let child of item.group" [value]="child.value" [disabled]="child.disabled">
              {{ child.label }}
            </mat-option>
          </mat-optgroup>
          <mat-option *ngIf="!item.group" [value]="item.value" [disabled]="item.disabled">{{ item.label }}</mat-option>
        </ng-container>
      </ng-container>
    </mat-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };

  private selectAllValue!: { options: any; value: any[] };

  getSelectAllState(options: any[]) {
    if (this.empty || this.value.length === 0) {
      return null;
    }

    return this.value.length !== this.getSelectAllValue(options).length ? 'indeterminate' : 'checked';
  }

  toggleSelectAll(options: any[]) {
    const selectAllValue = this.getSelectAllValue(options);
    this.formControl.setValue(!this.value || this.value.length !== selectAllValue.length ? selectAllValue : []);
    this.formControl.markAsDirty();
  }

  change($event: MatSelectChange) {
    this.to.change?.(this.field, $event);
  }

  _getAriaLabelledby() {
    if (this.to.attributes?.['aria-labelledby']) {
      return this.to.attributes['aria-labelledby'] as string;
    }

    return this.formField?._labelId;
  }

  _getAriaLabel() {
    return this.to.attributes?.['aria-label'] as string;
  }

  private getSelectAllValue(options: any[]) {
    if (!this.selectAllValue || options !== this.selectAllValue.options) {
      const flatOptions: any[] = [];
      options.forEach((o) => (o.group ? flatOptions.push(...o.group) : flatOptions.push(o)));

      this.selectAllValue = {
        options,
        value: flatOptions.filter((o) => !o.disabled).map((o) => o.value),
      };
    }

    return this.selectAllValue.value;
  }
}
