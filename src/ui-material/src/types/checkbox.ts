import { Component } from '@angular/core';
import { FieldType } from './field';

@Component({
  selector: 'formly-field-mat-checkbox',
  template: `
    <mat-checkbox
      [formControl]="formControl"
      [id]="id"
      [formlyAttributes]="field"
      (change)="change()"
      [indeterminate]="to.indeterminate && model[key] === undefined"
      [align]="to.align">
      {{ to.label }}
      <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
    </mat-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  change() {
    if (this.to.change) {
      if (this.to.change.length === 2) {
        this.to.change(this.field, this.formControl);
      } else {
        this.to.change(this.field);
      }
    }
  }
}
