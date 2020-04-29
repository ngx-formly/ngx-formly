import { Component, ViewChildren, QueryList } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'formly-field-mat-multicheckbox',
  template: `
    <ng-container *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;">
      <mat-checkbox
        [id]="id + '_' + i"
        [formlyAttributes]="field"
        [tabindex]="to.tabindex"
        [color]="to.color"
        [labelPosition]="to.labelPosition"
        [checked]="isChecked(option)"
        (change)="onChange(option.value, $event.checked)">
          {{ option.label }}
      </mat-checkbox>
    </ng-container>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;

  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      floatLabel: 'always',
      options: [],
      color: 'accent', // workaround for https://github.com/angular/components/issues/18465
    },
  };

  onChange(value: any, checked: boolean) {
    if (this.to.type === 'array') {
      this.formControl.patchValue(checked
        ? [...(this.formControl.value || []), value]
        : [...(this.formControl.value || [])].filter(o => o !== value),
      );
    } else {
      this.formControl.patchValue({ ...this.formControl.value, [value]: checked });
    }
    this.formControl.markAsTouched();
  }

  onContainerClick(event: MouseEvent): void {
    if (this.checkboxes.length) {
      this.checkboxes.first.focus();
    }
    super.onContainerClick(event);
  }

  isChecked(option: any) {
    const value = this.formControl.value;

    return value && (
      this.to.type === 'array'
        ? (value.indexOf(option.value) !== -1)
        : value[option.value]
    );
  }
}
