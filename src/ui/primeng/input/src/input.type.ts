import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

interface InputProps extends FormlyFieldProps {}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-primeng-input',
  template: `
    @if (props.type !== 'number') {
      <input pInputText [type]="props.type || 'text'" [formControl]="formControl" [formlyAttributes]="field" />
    } @else {
      <input type="number" pInputText [formControl]="formControl" [formlyAttributes]="field" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {}
