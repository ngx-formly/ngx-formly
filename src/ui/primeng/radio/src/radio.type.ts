import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

interface RadioProps extends FormlyFieldProps {}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-primeng-radio',
  template: `
    <div class="p-field-radiobutton" *ngFor="let option of props.options | formlySelectOptions: field | async">
      <p-radioButton
        [name]="field.name || id"
        [formControl]="formControl"
        [label]="option.label"
        [value]="option.value"
      >
      </p-radioButton>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {}
