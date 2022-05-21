import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

interface CheckboxProps extends FormlyFieldProps {}

export interface FormlyCheckboxFieldConfig extends FormlyFieldConfig<CheckboxProps> {
  type: 'checkbox' | Type<FormlyFieldCheckbox>;
}

@Component({
  selector: 'formly-field-primeng-checkbox',
  template: `
    <div class="p-field-checkbox">
      <p-checkbox
        [binary]="true"
        [label]="props.label"
        [formControl]="formControl"
        [formlyAttributes]="field"
        (onChange)="props.change && props.change(field, $event)"
      >
      </p-checkbox>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig<CheckboxProps>> {
  override defaultOptions = {
    props: {
      hideLabel: true,
    },
  };
}
