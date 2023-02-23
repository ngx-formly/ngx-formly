import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-multiselect',
  template: `
    <kendo-multiselect
      [class.k-state-invalid]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [data]="props.options | formlySelectOptions | async"
      [textField]="props.textField"
      [valueField]="props.valueField"
      [valuePrimitive]="props.primitive"
      [filterable]="props.filterable"
      (filterChange)="handleFilter($event)"
      (valueChange)="props.change && props.change(field, $event)"
    >
    </kendo-multiselect>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldMultiSelect extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    props: {
      textField: 'label',
      valueField: 'value',
      primitive: true,
      filterable: false,
      minFilter: 0,
      options: <any[]>[],
    },
  };

  handleFilter(value: any) {
    if (value.length >= this.props.minFilter) {
      this.field.props?.filter(
        this.props.textField,
        this.props.filterOperator,
        value
      );
    }
  }
}
