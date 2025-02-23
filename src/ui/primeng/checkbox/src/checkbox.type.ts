import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps as CheckboxProps } from '@ngx-formly/primeng/form-field';

export interface FormlyCheckboxFieldConfig extends FormlyFieldConfig<CheckboxProps> {
  type: 'checkbox' | Type<FormlyFieldCheckbox>;
}

@Component({
  selector: 'formly-field-primeng-checkbox',
  template: `
    <div class="p-field-checkbox flex items-center gap-1">
      <p-checkbox
        [binary]="true"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [inputId]="id"
        [id]="undefined"
      />
      <label [for]="id" class="ml-2">{{ props.label }}</label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig<CheckboxProps>> {
  override defaultOptions = { props: { hideLabel: true } };
}
