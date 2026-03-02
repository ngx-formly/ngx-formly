import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

type RadioProps = FormlyFieldProps;

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-primeng-radio',
  template: `
    @for (option of props.options | formlySelectOptions: field | async; track option; let index = $index) {
      <div class="p-field-radiobutton">
        <p-radioButton
          [name]="field.name || id"
          [formControl]="option.disabled ? disabledControl : formControl"
          [value]="option.value"
          [inputId]="id + index"
        >
        </p-radioButton>
        <label [for]="id + index" class="ml-2">{{ option.label }}</label>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  get disabledControl() {
    return new UntypedFormControl({ value: this.formControl.value, disabled: true });
  }
}
