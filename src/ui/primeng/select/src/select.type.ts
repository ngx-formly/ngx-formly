import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';
import { Select } from 'primeng/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  appendTo?: Select['appendTo'];
  filter?: boolean;
  filterBy?: string;
  multiple?: boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-primeng-select',
  template: `
    @if (props.multiple) {
      <p-multiselect
        [fluid]="true"
        [inputId]="id"
        [id]="id + '-container'"
        [placeholder]="props.placeholder"
        [options]="props.options | formlySelectOptions: field | async"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [showClear]="!props.required"
        [appendTo]="props.appendTo"
        [filter]="props.filter ?? false"
        [filterBy]="props.filterBy ?? 'label'"
        optionLabel="label"
        optionValue="value"
        optionDisabled="disabled"
        (onChange)="props.change && props.change(field, $event)"
      />
    } @else {
      <p-select
        [fluid]="true"
        [inputId]="id"
        [id]="id + '-container'"
        [placeholder]="props.placeholder"
        [options]="props.options | formlySelectOptions: field | async"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [showClear]="!props.required"
        [appendTo]="props.appendTo"
        [filter]="props.filter"
        [filterBy]="props.filterBy ?? 'label'"
        [optionLabel]="'label'"
        [optionValue]="'value'"
        optionDisabled="disabled"
        (onChange)="props.change && props.change(field, $event)"
      >
      </p-select>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {}
