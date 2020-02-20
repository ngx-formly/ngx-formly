import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'formly-field-mat-checkbox',
  template: `
    <mat-checkbox
      [formControl]="formControl"
      [id]="id"
      [formlyAttributes]="field"
      [tabindex]="to.tabindex || 0"
      [indeterminate]="to.indeterminate && formControl.value === null"
      [color]="to.color"
      [labelPosition]="to.align || to.labelPosition">
      {{ to.label }}
      <span *ngIf="to.required && to.hideRequiredMarker !== true" class="mat-form-field-required-marker">*</span>
    </mat-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  @ViewChild(MatCheckbox) checkbox!: MatCheckbox;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      indeterminate: true,
      floatLabel: 'always',
      hideLabel: true,
      align: 'start', // start or end
      color: 'accent', // workaround for https://github.com/angular/components/issues/18465
    },
  };

  onContainerClick(event: MouseEvent): void {
    this.checkbox.focus();
    super.onContainerClick(event);
  }
}
