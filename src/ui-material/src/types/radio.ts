import { Component } from '@angular/core';
import { FieldType } from './field';

@Component({
  selector: 'formly-field-mat-radio',
  template: `
    <mat-radio-group [formControl]="formControl" [formlyAttributes]="field" (change)="change()">
      <mat-radio-button *ngFor="let option of to.options; let i = index;" [id]="id + '_' + i" [value]="option.label ? option.value : option.key">
        {{ option.label ? option.label : option.value }}
      </mat-radio-button>
    </mat-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType {
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
