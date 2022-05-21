import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';

interface MultiCheckboxProps extends FormlyFieldProps {
  formCheck: 'default' | 'inline' | 'switch' | 'inline-switch';
}

export interface FormlyMultiCheckboxFieldConfig extends FormlyFieldConfig<MultiCheckboxProps> {
  type: 'multicheckbox' | Type<FormlyFieldMultiCheckbox>;
}

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div
      *ngFor="let option of props.options | formlySelectOptions: field | async; let i = index"
      class="form-check"
      [ngClass]="{
        'form-check-inline': props.formCheck === 'inline' || props.formCheck === 'inline-switch',
        'form-switch': props.formCheck === 'switch' || props.formCheck === 'inline-switch'
      }"
    >
      <input
        type="checkbox"
        [id]="id + '_' + i"
        class="form-check-input"
        [value]="option.value"
        [checked]="isChecked(option)"
        [formlyAttributes]="field"
        [disabled]="formControl.disabled || option.disabled"
        (change)="onChange(option.value, $any($event.target).checked)"
      />
      <label class="form-check-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldMultiCheckbox extends FieldType<FieldTypeConfig<MultiCheckboxProps>> {
  override defaultOptions = {
    props: {
      formCheck: 'default' as const, // 'default' | 'inline' | 'switch' | 'inline-switch'
    },
  };

  onChange(value: any, checked: boolean) {
    if (this.props.type === 'array') {
      this.formControl.patchValue(
        checked
          ? [...(this.formControl.value || []), value]
          : [...(this.formControl.value || [])].filter((o) => o !== value),
      );
    } else {
      this.formControl.patchValue({ ...this.formControl.value, [value]: checked });
    }
    this.formControl.markAsTouched();
  }

  isChecked(option: any) {
    const value = this.formControl.value;

    return value && (this.props.type === 'array' ? value.indexOf(option.value) !== -1 : value[option.value]);
  }
}
