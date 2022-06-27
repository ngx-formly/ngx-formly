import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps, NebularCommonOptions } from '@ngx-formly/nebular/form-field';

interface TextAreaProps extends FormlyFieldProps, NebularCommonOptions {
  cols?: number;
  rows?: number;
  fullWidth?: boolean;
}

export interface FormlyTextAreaFieldConfig extends FormlyFieldConfig<TextAreaProps> {
  type: 'textarea' | Type<FormlyFieldTextArea>;
}

@Component({
  selector: 'formly-field-textarea',
  template: `
    <textarea
      nbInput
      [formControl]="formControl"
      [formlyAttributes]="field"
      [fullWidth]="props.fullWidth || false"
      [status]="showError ? 'danger' : props.status"
      [rows]="props.rows"
      [cols]="props.cols"
      [fieldSize]="props.size"
      [shape]="props.shape"
      [placeholder]="props.placeholder"
    ></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig<TextAreaProps>> {
  override defaultOptions?: Partial<FieldTypeConfig<TextAreaProps>> = {
    props: {
      status: 'info',
      shape: 'rectangle',
      size: 'medium',
    },
  };
}
