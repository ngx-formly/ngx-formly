import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-multicheckbox',
  template: `
    <ng-container *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;">
      <mat-checkbox
        [id]="id + '_' + i"
        [formlyAttributes]="field"
        [color]="to.color"
        [labelPosition]="to.labelPosition"
        [checked]="formControl.value && formControl.value[option.value]"
        (change)="onChange(option.value, $event.checked)">
          {{ option.label }}
      </mat-checkbox>
    </ng-container>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
  onChange(value, checked) {
    this.formControl.patchValue({ ...this.formControl.value, [value]: checked });
    this.formControl.markAsTouched();
  }
}
