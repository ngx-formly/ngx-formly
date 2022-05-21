import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ng-zorro-antd/form-field';

interface CheckboxProps extends FormlyFieldProps {
  indeterminate?: boolean;
}

export interface FormlyCheckboxFieldConfig extends FormlyFieldConfig<CheckboxProps> {
  type: 'checkbox' | Type<FormlyFieldCheckbox>;
}

@Component({
  selector: 'formly-field-nz-checkbox',
  template: `
    <label
      nz-checkbox
      [nzIndeterminate]="props.indeterminate && formControl.value == null"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ngModelChange)="props.change && props.change(field, $event)"
    >
      {{ props.label }}
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig<CheckboxProps>> {
  override defaultOptions = {
    props: {
      indeterminate: true,
      hideLabel: true,
    },
  };
}
