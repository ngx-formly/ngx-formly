import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/optimus-ui/form-field';

type RadioProps = FormlyFieldProps;

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-optimus-ui-radio',
  host: {
    role: 'radiogroup',
    '[attr.aria-labelledby]': "props.label && !props.hideLabel ? id + '-label' : null",
  },
  template: `
    @for (option of props.options | formlySelectOptions: field | async; track option; let index = $index) {
      <div class="p-field-radiobutton field-radiobutton">
        <p-radiobutton
          [name]="field.name || id"
          [formlyAttributes]="field"
          [id]="id + index + '-container'"
          [formControl]="option.disabled ? disabledControl : formControl"
          [value]="option.value"
          [inputId]="id + index"
        />
        <label [for]="id + index">{{ option.label }}</label>
      </div>
    }
  `,
  styleUrl: '../../choice-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  get disabledControl() {
    return new UntypedFormControl({ value: this.formControl.value, disabled: true });
  }
}
