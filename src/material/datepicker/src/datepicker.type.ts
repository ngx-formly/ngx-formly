import { Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'formly-field-mat-datepicker',
  template: `
    <input matInput
      [id]="id"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [matDatepicker]="picker"
      [matDatepickerFilter]="to.datepickerOptions.filter"
      [max]="to.datepickerOptions.max"
      [min]="to.datepickerOptions.min"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [tabindex]="to.tabindex || 0"
      [readonly]="to.readonly">
    <ng-template #matSuffix>
      <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
    </ng-template>
    <mat-datepicker #picker
      [color]="to.color"
      [touchUi]="to.datepickerOptions.touchUi"
      [startView]="to.datepickerOptions.startView"
      [startAt]="to.datepickerOptions.startAt">
    </mat-datepicker>
  `,
})
export class FormlyDatepickerTypeComponent extends FieldType {
  @ViewChild(MatInput) formFieldControl!: MatInput;
  defaultOptions = {
    templateOptions: {
      datepickerOptions: {
        startView: 'month',
      },
    },
  };
}
