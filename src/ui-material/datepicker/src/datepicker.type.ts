import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'formly-field-mat-datepicker',
  template: `
    <input matInput
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [matDatepicker]="picker"
      [matDatepickerFilter]="to.datepickerOptions.filter"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder">
    <ng-template #matSuffix>
      <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
    </ng-template>
    <mat-datepicker #picker
      [touchUi]="to.datepickerOptions.touchUi"
      [startView]="to.datepickerOptions.startView"
      [startAt]="to.datepickerOptions.startAt">
    </mat-datepicker>
  `,
})
export class FormlyDatepickerTypeComponent extends FieldType {
  @ViewChild(MatInput) formFieldControl: MatInput;
}
