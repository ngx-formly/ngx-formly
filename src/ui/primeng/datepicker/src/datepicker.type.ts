import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

interface DatepickerProps extends FormlyFieldProps {
  defaultDate?: Date;
  dateFormat?: string;
  hourFormat?: string;
  showTime?: boolean;
  showIcon?: boolean;
  showButtonBar?: boolean;
  showOtherMonths?: boolean;
  selectOtherMonths?: boolean;
  selectionMode?: 'multiple' | 'single' | 'range';
  numberOfMonths?: number;
  inline?: boolean;
  readonlyInput?: boolean;
  touchUI?: boolean;
  monthNavigator?: boolean;
  yearNavigator?: boolean;
  yearRange?: string;
}

export interface FormlyDatepickerFieldConfig extends FormlyFieldConfig<DatepickerProps> {
  type: 'datepicker' | Type<FormlyFieldDatepicker>;
}

@Component({
  selector: 'formly-field-primeng-datepicker',
  template: `
    <p-datepicker
      [defaultDate]="props.defaultDate"
      [dateFormat]="props.dateFormat"
      [hourFormat]="props.hourFormat"
      [showTime]="props.showTime"
      [showIcon]="props.showIcon"
      [showButtonBar]="props.showButtonBar"
      [showOtherMonths]="props.showOtherMonths"
      [selectOtherMonths]="props.selectOtherMonths"
      [selectionMode]="props.selectionMode || 'single'"
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
    </p-datepicker>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldDatepicker extends FieldType<FieldTypeConfig<DatepickerProps>> {
  override defaultOptions?: Partial<FieldTypeConfig<DatepickerProps>> = {
    props: {
      numberOfMonths: 1,
    },
  };
}
