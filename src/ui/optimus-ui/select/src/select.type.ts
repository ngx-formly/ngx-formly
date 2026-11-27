import { Component, ChangeDetectionStrategy, ElementRef, TemplateRef, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/optimus-ui/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  appendTo?: 'body' | 'self' | HTMLElement | ElementRef | TemplateRef<unknown> | null;
  filter?: boolean;
  filterBy?: string;
  multiple?: boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-optimus-ui-select',
  template: `
    @if (props.multiple) {
      <p-multiselect
        [ariaLabelledBy]="props.label && !props.hideLabel ? id + '-label' : undefined"
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
        [ariaLabelledBy]="props.label && !props.hideLabel ? id + '-label' : undefined"
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
        optionLabel="label"
        optionValue="value"
        optionDisabled="disabled"
        (onChange)="props.change && props.change(field, $event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {}
