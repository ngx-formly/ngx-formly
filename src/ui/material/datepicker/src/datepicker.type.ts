import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { FieldTypeConfig, FormlyConfig, ɵobserve as observe } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-datepicker',
  template: `
    <input
      matInput
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
export class FormlyFieldDatepicker extends FieldType<FieldTypeConfig> implements AfterViewInit, OnDestroy {
  @ViewChild('datepickerToggle', { static: true }) datepickerToggle!: TemplateRef<any>;

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
  private fieldErrorsObserver!: ReturnType<typeof observe>;

  constructor(private config: FormlyConfig) {
    super();
  }

  detectChanges() {
    this.options.detectChanges?.(this.field);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.to[this.to.datepickerOptions.datepickerTogglePosition] = this.datepickerToggle;

    // temporary fix for https://github.com/angular/components/issues/16761
    if (this.config.getValidatorMessage('matDatepickerParse')) {
      this.fieldErrorsObserver = observe<any>(this.field, ['formControl', 'errors'], ({ currentValue }) => {
        if (currentValue.required && currentValue.matDatepickerParse) {
          const errors = Object.keys(currentValue)
            .sort((prop) => (prop === 'matDatepickerParse' ? -1 : 0))
            .reduce((errors, prop) => ({ ...errors, [prop]: currentValue[prop] }), {});

          this.fieldErrorsObserver?.setValue(errors);
        }
      });
    }
  }

  ngOnDestroy() {
    this.fieldErrorsObserver?.unsubscribe();
  }
}
