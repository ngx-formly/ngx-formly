import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

interface DatepickerProps extends FormlyFieldProps {
  dateFormat?: string;
  defaultDate?: Date;
  hourFormat?: string;
  inline?: boolean;
  monthNavigator?: boolean;
  numberOfMonths?: number;
  readonlyInput?: boolean;
  selectionMode?: string;
  selectOtherMonths?: boolean;
  showButtonBar?: boolean;
  showClear?: boolean;
  showIcon?: boolean;
  showOtherMonths?: boolean;
  showSeconds?: boolean;
  showTime?: boolean;
  stepHour?: number;
  stepMinute?: number;
  stepSecond?: number;
  touchUI?: boolean;
  yearNavigator?: boolean;
  yearRange?: string;
}

export interface FormlyDatepickerFieldConfig extends FormlyFieldConfig<DatepickerProps> {
  type: 'datepicker' | Type<FormlyFieldDatepicker>;
}

@Component({
  selector: 'formly-field-primeng-datepicker',
  template: `
    <p-calendar
      [defaultDate]="props.defaultDate"
      [dateFormat]="props.dateFormat"
      [hourFormat]="props.hourFormat"
      [showTime]="props.showTime"
      [showIcon]="props.showIcon"
      [showButtonBar]="props.showButtonBar"
      [showOtherMonths]="props.showOtherMonths"
      [selectOtherMonths]="props.selectOtherMonths"
      [selectionMode]="props.selectionMode || 'single'"
      [stepMinute]="props.stepMinute"
      [stepHour]="props.stepHour"
      [stepSecond]="props.stepSecond"
      [showSeconds]="props.showSeconds"
      [showClear]="props.showClear"
      [numberOfMonths]="props.numberOfMonths"
      [inline]="props.inline"
      [readonlyInput]="props.readonlyInput"
      [touchUI]="props.touchUI"
      [monthNavigator]="props.monthNavigator"
      [yearNavigator]="props.yearNavigator"
      [yearRange]="props.yearRange"
      [placeholder]="props.placeholder"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
    </p-calendar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldDatepicker extends FieldType<FieldTypeConfig<DatepickerProps>> {}
