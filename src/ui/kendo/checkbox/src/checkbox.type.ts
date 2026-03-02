import { Component, ChangeDetectionStrategy, ViewEncapsulation, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/kendo/form-field';

interface CheckboxProps extends FormlyFieldProps {}

export interface FormlyCheckboxFieldConfig extends FormlyFieldConfig<CheckboxProps> {
  type: 'checkbox' | Type<FormlyFieldCheckbox>;
}

@Component({
  selector: 'formly-field-kendo-checkbox',
  template: `
    <input type="checkbox" kendoCheckBox [formControl]="formControl" [formlyAttributes]="field" />
    <label [for]="id" class="k-checkbox-label">
      {{ props.label }}
      @if (props.required && props.hideRequiredMarker !== true) {
        <span aria-hidden="true" class="k-required">*</span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./checkbox.type.scss'],
  standalone: false,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig<CheckboxProps>> {
  override defaultOptions = {
    props: {
      hideLabel: true,
    },
  };
}
