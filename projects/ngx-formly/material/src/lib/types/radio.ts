import { Component } from '@angular/core';
import { FieldType } from './field';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'formly-field-mat-radio',
  template: `
    <mat-radio-group [formControl]="formControl" [formlyAttributes]="field" (change)="change($event)">
      <mat-radio-button *ngFor="let option of to.options; let i = index;" [id]="id + '_' + i" [value]="option.label ? option.value : option.key">
        {{ option.label ? option.label : option.value }}
      </mat-radio-button>
    </mat-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType {
  change($event: MatRadioChange) {
    if (this.to.change) {
      this.to.change(this.field, $event);
    }
  }
}
