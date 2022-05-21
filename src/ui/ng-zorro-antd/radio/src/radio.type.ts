import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ng-zorro-antd/form-field';

interface RadioProps extends FormlyFieldProps {}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-nz-radio',
  template: `
    <nz-radio-group [formControl]="formControl" (ngModelChange)="props.change && props.change(field, $event)">
      <label
        nz-radio
        *ngFor="let option of props.options | formlySelectOptions: field | async"
        [nzValue]="option.value"
      >
        {{ option.label }}
      </label>
    </nz-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {}
