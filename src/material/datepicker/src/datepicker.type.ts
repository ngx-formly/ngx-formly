import { Component, ViewChild, AfterViewInit, TemplateRef, OnDestroy } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { FormlyConfig, ɵwrapProperty as wrapProperty } from '@ngx-formly/core';

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
      [tabindex]="to.tabindex"
      [readonly]="to.readonly"
      [required]="to.required"
      (dateInput)="to.datepickerOptions.dateInput(field, $event)"
      (dateChange)="to.datepickerOptions.dateChange(field, $event)">
    <ng-template #datepickerToggle>
      <mat-datepicker-toggle [disabled]="to.disabled" [for]="picker"></mat-datepicker-toggle>
    </ng-template>
    <mat-datepicker #picker
      [color]="to.color"
      [dateClass]="to.datepickerOptions.dateClass"
      [disabled]="to.datepickerOptions.disabled"
      [opened]="to.datepickerOptions.opened"
      [panelClass]="to.datepickerOptions.panelClass"
      [startAt]="to.datepickerOptions.startAt"
      [startView]="to.datepickerOptions.startView"
      [touchUi]="to.datepickerOptions.touchUi"
      (monthSelected)="to.datepickerOptions.monthSelected(field, $event, picker)"
      (yearSelected)="to.datepickerOptions.yearSelected(field, $event, picker)"
    >
    </mat-datepicker>
  `,
})
export class FormlyFieldDatepicker extends FieldType implements AfterViewInit, OnDestroy {
  @ViewChild(MatInput, <any> { static: true }) formFieldControl!: MatInput;
  @ViewChild(MatDatepickerInput, <any> { static: true }) datepickerInput!: MatDatepickerInput<any>;
  @ViewChild('datepickerToggle') datepickerToggle!: TemplateRef<any>;

  defaultOptions = {
    templateOptions: {
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
  private fieldErrorsObserver!: Function;

  constructor(private config: FormlyConfig) {
    super();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // temporary fix for https://github.com/angular/components/issues/16761
    if (this.config.getValidatorMessage('matDatepickerParse')) {
      wrapProperty(this.field.formControl, 'errors', ({ currentValue }) => {
        if (currentValue.required && currentValue.matDatepickerParse) {
          const errors = Object.keys(currentValue)
            .sort(prop => prop === 'matDatepickerParse' ? -1 : 0)
            .reduce((errors, prop) => ({ ...errors, [prop]: currentValue[prop] }), {});
          this.field.formControl['___$errors'] = errors;
        }
      });
    }

    // temporary fix for https://github.com/angular/material2/issues/6728
    (<any> this.datepickerInput)._formField = this.formField;

    setTimeout(() => {
      switch (this.to.datepickerOptions.datepickerTogglePosition) {
        case 'suffix':
          this.to._matSuffix = this.datepickerToggle;
          break;

        case 'prefix':
          this.to._matPrefix = this.datepickerToggle;
          break;
      }

      (<any> this.options)._markForCheck(this.field);
    });
  }

  ngOnDestroy() {
    this.fieldErrorsObserver && this.fieldErrorsObserver();
  }
}
