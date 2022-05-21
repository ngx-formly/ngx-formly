import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';

interface RadioProps extends FormlyFieldProps {
  formCheck?: 'default' | 'inline';
}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-radio',
  template: `
    <div
      *ngFor="let option of props.options | formlySelectOptions: field | async; let i = index"
      class="form-check"
      [class.form-check-inline]="props.formCheck === 'inline'"
    >
      <input
        type="radio"
        [id]="id + '_' + i"
        class="form-check-input"
        [name]="field.name || id"
        [class.is-invalid]="showError"
        [attr.value]="option.value"
        [value]="option.value"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [attr.disabled]="option.disabled || formControl.disabled ? true : null"
      />
      <label class="form-check-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  override defaultOptions = {
    props: {
      formCheck: 'default' as const,
    },
  };
}
