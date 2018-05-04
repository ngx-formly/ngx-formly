import { Component } from '@angular/core';
import { FieldType } from './field';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'formly-field-mat-checkbox',
  template: `
    <mat-checkbox
      [formControl]="formControl"
      [id]="id"
      [formlyAttributes]="field"
      (change)="change($event)"
      [indeterminate]="to.indeterminate && model[key] === undefined"
      [labelPosition]="to.align">
      {{ to.label }}
      <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
    </mat-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  change($event: MatCheckboxChange) {
    if (this.to.change) {
      this.to.change(this.field, $event);
    }
  }
}
