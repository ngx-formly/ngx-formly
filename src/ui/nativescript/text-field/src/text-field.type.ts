import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/nativescript/form-field';

interface InputProps extends FormlyFieldProps {
  autocorrect?: boolean;
  secure?: boolean;
  hint?: string;
  keyboardType?: any;
}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-ns-input',
  template: `
    <TextField
      class="input"
      [formlyAttributes]="field"
      [formControl]="formControl"
      [autocorrect]="props.autocorrect"
      [secure]="props.secure"
      [hint]="props.hint"
      [keyboardType]="props.keyboardType"
    >
    </TextField>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {}
