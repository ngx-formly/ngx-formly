import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  TemplateRef,
  ChangeDetectorRef,
  Type,
} from '@angular/core';
import { FieldTypeConfig, FormlyConfig, FormlyFieldConfig, ɵobserve as observe } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
import { ComponentType } from '@angular/cdk/portal';
import { MatCalendarCellClassFunction, MatDatepicker } from '@angular/material/datepicker';

interface DatepickerProps extends FormlyFieldProps {
  datepickerOptions?: Partial<{
    touchUi: boolean;
    opened: boolean;
    disabled: boolean;
    startView: 'month' | 'year' | 'multi-year';
    datepickerTogglePosition: 'suffix' | 'prefix';
    calendarHeaderComponent: ComponentType<any>;
    filter: (date: any | null) => boolean;
    min: any;
    max: any;
    dateInput: (field: FieldTypeConfig<DatepickerProps>, event: any) => void;
    dateChange: (field: FieldTypeConfig<DatepickerProps>, event: any) => void;

    monthSelected: (field: FieldTypeConfig<DatepickerProps>, event: any, picker: MatDatepicker<any>) => void;
    yearSelected: (field: FieldTypeConfig<DatepickerProps>, event: any, picker: MatDatepicker<any>) => void;

    dateClass: MatCalendarCellClassFunction<any>;
    panelClass: string | string[];
    startAt: any | null;
  }>;
}

export interface FormlyDatepickerFieldConfig extends FormlyFieldConfig<DatepickerProps> {
  type: 'datepicker' | Type<FormlyFieldDatepicker>;
}

@Component({
  selector: 'formly-field-mat-datepicker',
  template: `
    <input
      matInput
      [id]="id"
      [name]="field.name"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [matDatepicker]="picker"
      [matDatepickerFilter]="props.datepickerOptions.filter"
      [max]="props.datepickerOptions.max"
      [min]="props.datepickerOptions.min"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder"
      [tabindex]="props.tabindex"
      [readonly]="props.readonly"
      [required]="required"
      (dateInput)="props.datepickerOptions.dateInput(field, $event)"
      (dateChange)="props.datepickerOptions.dateChange(field, $event)"
    />
    <ng-template #datepickerToggle>
      <mat-datepicker-toggle
        (click)="detectChanges()"
        [disabled]="props.disabled"
        [for]="picker"
      ></mat-datepicker-toggle>
    </ng-template>
    <mat-datepicker
      #picker
      [color]="props.color"
      [dateClass]="props.datepickerOptions.dateClass"
      [disabled]="props.datepickerOptions.disabled"
      [opened]="props.datepickerOptions.opened"
      [panelClass]="props.datepickerOptions.panelClass"
      [startAt]="props.datepickerOptions.startAt"
      [startView]="props.datepickerOptions.startView"
      [touchUi]="props.datepickerOptions.touchUi"
      [calendarHeaderComponent]="props.datepickerOptions.calendarHeaderComponent"
      (monthSelected)="props.datepickerOptions.monthSelected(field, $event, picker)"
      (yearSelected)="props.datepickerOptions.yearSelected(field, $event, picker)"
      (opened)="props.datepickerOptions.opened = true"
      (closed)="props.datepickerOptions.opened = false"
    >
    </mat-datepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldDatepicker
  extends FieldType<FieldTypeConfig<DatepickerProps>>
  implements AfterViewInit, OnDestroy
{
  @ViewChild('datepickerToggle', { static: true }) datepickerToggle!: TemplateRef<any>;

  override defaultOptions = {
    props: {
      datepickerOptions: {
        startView: 'month' as const,
        datepickerTogglePosition: 'suffix' as const,
        disabled: false,
        opened: false,
        dateInput: () => {},
        dateChange: () => {},
        monthSelected: () => {},
        yearSelected: () => {},
      },
    },
  };
  private fieldErrorsObserver!: ReturnType<typeof observe>;

  constructor(private config: FormlyConfig, private cdRef: ChangeDetectorRef) {
    super();
  }

  detectChanges() {
    this.options.detectChanges?.(this.field);
  }

  ngAfterViewInit() {
    this.props[this.props.datepickerOptions.datepickerTogglePosition] = this.datepickerToggle;
    observe<boolean>(this.field, ['props', 'datepickerOptions', 'opened'], () => {
      this.cdRef.detectChanges();
    });

    // temporary fix for https://github.com/angular/components/issues/16761
    if (this.config.getValidatorMessage('matDatepickerParse')) {
      this.fieldErrorsObserver = observe<any>(this.field, ['formControl', 'errors'], ({ currentValue }) => {
        if (currentValue && currentValue.required && currentValue.matDatepickerParse) {
          const errors = Object.keys(currentValue)
            .sort((prop) => (prop === 'matDatepickerParse' ? -1 : 0))
            .reduce((errors, prop) => ({ ...errors, [prop]: currentValue[prop] }), {});

          this.fieldErrorsObserver?.setValue(errors);
        }
      });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.fieldErrorsObserver?.unsubscribe();
  }
}
