import { Component, AfterViewInit, Renderer2 } from '@angular/core';
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
export class FormlyFieldCheckbox extends FieldType implements AfterViewInit {
  constructor(private renderer?: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    if (this.formField) {
      // temporary fix for https://github.com/angular/material2/issues/7891
      if (this.formField.underlineRef && this.renderer) {
        this.renderer.removeClass(this.formField.underlineRef.nativeElement, 'mat-form-field-underline');
      }
    }
  }

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
