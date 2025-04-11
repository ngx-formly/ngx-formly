import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';
interface MultiSelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  appendTo?: any;
  filter?: boolean;
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  filterPlaceHolder?: string;
  selectAll?: boolean;
  showToggleAll?: boolean;
  showClear?: boolean;
  autocomplete?: string;
  display?: string;
  group?: boolean;
  virtualScroll?: boolean;
  virtualScrollItemSize?: number;
  virtualScrollOptions?: any;
  lazy?: boolean;
  filterMatchMode?:
    | 'endsWith'
    | 'startsWith'
    | 'contains'
    | 'equals'
    | 'notEquals'
    | 'in'
    | 'lt'
    | 'lte'
    | 'gt'
    | 'gte';
}

export interface FormlyMultiSelectFieldConfig extends FormlyFieldConfig<MultiSelectProps> {
  type: 'multi' | Type<FormlyFieldMultiSelect>;
}

@Component({
  selector: 'formly-field-primeng-multiselect',
  template: `
    <p-multiSelect
      [options]="props.options | formlySelectOptions : field | async"
      [placeholder]="props.placeholder"
      [optionLabel]="props.optionLabel ?? 'label'"
      [optionValue]="props.optionValue"
      [filterMatchMode]="props.filterMatchMode ?? 'contains'"
      [filterPlaceHolder]="props.filterPlaceHolder"
      [showToggleAll]="props.showToggleAll"
      [showClear]="props.showClear ?? false"
      [autocomplete]="props.autocomplete"
      [formControl]="formControl"
      [display]="props.display ?? 'comma'"
      [virtualScroll]="props.virtualScroll"
      [group]="props.group"
      (onChange)="props.change && props.change(field, $event)"
      [formlyAttributes]="field"
    >
      <ng-template let-group pTemplate="group">
        <div class="flex align-items-center">
          <span>{{ group.label }}</span>
        </div>
      </ng-template>
    </p-multiSelect>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldMultiSelect extends FieldType<FieldTypeConfig<MultiSelectProps>> {}
