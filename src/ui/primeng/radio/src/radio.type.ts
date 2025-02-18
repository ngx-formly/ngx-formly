import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

interface RadioProps extends FormlyFieldProps {}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-primeng-radio',
  template: `
    <div class="p-field-radiobutton" *ngFor="let option of props.options | formlySelectOptions : field | async">
      <p-radioButton
        ngDefaultControl
        [name]="field.name || id"
        [formControl]="option.disabled ? disabledControl : formControl"
        [inputId]="field.name || id"
        [value]="option.value"
      >
      </p-radioButton>
      <label class="ml-2" [for]="id">{{ option.label }}</label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  get disabledControl() {
    return new FormControl({ value: this.formControl.value, disabled: true });
  }
}
