import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-datepicker',
  template: `
    <input
      matInput
      [id]="id"
      [type]="to.type"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [matDatepicker]="picker"
      [matDatepickerFilter]="to.datepickerOptions.filter"
      [max]="to.datepickerOptions.max"
      [min]="to.datepickerOptions.min"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [tabindex]="to.tabindex"
      [readonly]="to.readonly"
      [required]="to.required"
      (dateInput)="to.datepickerOptions.dateInput(field, $event)"
      (dateChange)="to.datepickerOptions.dateChange(field, $event)"
    />
    <ng-template #datepickerToggle>
      <mat-datepicker-toggle (click)="detectChanges()" [disabled]="to.disabled" [for]="picker"></mat-datepicker-toggle>
    </ng-template>
    <mat-datepicker
      #picker
      [color]="to.color"
      [dateClass]="to.datepickerOptions.dateClass"
      [disabled]="to.datepickerOptions.disabled"
      [opened]="to.datepickerOptions.opened"
      [panelClass]="to.datepickerOptions.panelClass"
      [startAt]="to.datepickerOptions.startAt"
      [startView]="to.datepickerOptions.startView"
      [touchUi]="to.datepickerOptions.touchUi"
      [calendarHeaderComponent]="to.datepickerOptions.calendarHeaderComponent"
      (monthSelected)="to.datepickerOptions.monthSelected(field, $event, picker)"
      (yearSelected)="to.datepickerOptions.yearSelected(field, $event, picker)"
    >
    </mat-datepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyDatepickerTypeComponent extends FieldType implements AfterViewInit {
  @ViewChild('datepickerToggle', { static: true }) datepickerToggle!: TemplateRef<any>;

  defaultOptions = {
    templateOptions: {
      type: 'text',
      datepickerOptions: {
        startView: 'month',
        datepickerTogglePosition: 'suffix',
        dateInput: () => {},
        dateChange: () => {},
        monthSelected: () => {},
        yearSelected: () => {},
      },
    },
  };

  detectChanges() {
    this.options.detectChanges?.(this.field);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.to[this.to.datepickerOptions.datepickerTogglePosition] = this.datepickerToggle;
    
    if (!['text', 'tel'].includes(this.to.type)) {
      this.type.to = "text";
    }
  }
}
