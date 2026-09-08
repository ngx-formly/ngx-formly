import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/kendo/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  primitive?: boolean;
  multiple?: boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-kendo-select',
  template: `
    @if (props.multiple) {
      <kendo-multiselect
        [focusableId]="id"
        [id]="id + '-container'"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [data]="props.options | formlySelectOptions: field | async"
        [placeholder]="props.placeholder"
        textField="label"
        valueField="value"
        [valuePrimitive]="props.primitive ?? true"
        [itemDisabled]="itemDisabled"
        (valueChange)="props.change && props.change(field, $event)"
      />
    } @else {
      <kendo-dropdownlist
        [id]="id"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [data]="props.options | formlySelectOptions: field | async"
        [textField]="'label'"
        [valueField]="'value'"
        [valuePrimitive]="props.primitive ?? true"
        [defaultItem]="props.placeholder ? { label: props.placeholder, value: null } : undefined"
        [itemDisabled]="itemDisabled"
        (valueChange)="props.change && props.change(field, $event)"
      >
      </kendo-dropdownlist>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {
  itemDisabled = ({ dataItem }: { dataItem: { disabled?: boolean } }) => !!dataItem.disabled;
}
