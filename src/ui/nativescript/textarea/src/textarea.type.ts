import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/nativescript/form-field';

interface TextAreaProps extends FormlyFieldProps {
  hint?: string;
  autocorrect?: boolean;
  keyboardType?: any;
}

export interface FormlyTextAreaFieldConfig extends FormlyFieldConfig<TextAreaProps> {
  type: 'textarea' | Type<FormlyFieldTextArea>;
}

@Component({
  selector: 'formly-field-ns-textarea',
  template: `
    <TextView
      class="input"
      [formlyAttributes]="field"
      [formControl]="formControl"
      [hint]="props.hint"
      [autocorrect]="props.autocorrect"
      [keyboardType]="props.keyboardType"
    >
    </TextView>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig<TextAreaProps>> {}
