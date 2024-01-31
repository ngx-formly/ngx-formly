import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  appendTo?: any;
  filter?: boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-primeng-select',
  template: `
    <p-dropdown
      [placeholder]="props.placeholder"
      [options]="props.options | formlySelectOptions : field | async"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [showClear]="!props.required"
      [appendTo]="props.appendTo"
      [filter]="props.filter"
      (onChange)="props.change && props.change(field, $event)"
    >
    </p-dropdown>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {}
