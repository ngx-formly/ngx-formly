import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-input',
  template: `
    <input *ngIf="type !== 'number'; else numberTmp"
      matInput
      [id]="id"
      [type]="type || 'text'"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder">
    <ng-template #numberTmp>
      <input matInput
             [id]="id"
             type="number"
             [errorStateMatcher]="errorStateMatcher"
             [formControl]="formControl"
             [formlyAttributes]="field"
             [placeholder]="to.placeholder">
    </ng-template>
  `,
})
export class FormlyFieldInput extends FieldType implements OnInit {
  @ViewChild(MatInput) formFieldControl: MatInput;

  get type() {
    return this.to.type || 'text';
  }
}
