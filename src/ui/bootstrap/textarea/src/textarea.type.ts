import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';

interface TextAreaProps extends FormlyFieldProps {
  cols?: number;
  rows?: number;
}

export interface FormlyTextAreaFieldConfig extends FormlyFieldConfig<TextAreaProps> {
  type: 'textarea' | Type<FormlyFieldTextArea>;
}

@Component({
  selector: 'formly-field-textarea',
  template: `
    <textarea
      [formControl]="formControl"
      [cols]="props.cols"
      [rows]="props.rows"
      class="form-control"
      [class.is-invalid]="showError"
      [formlyAttributes]="field"
    >
    </textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig<TextAreaProps>> {
  override defaultOptions = {
    props: {
      cols: 1,
      rows: 1,
    },
  };
}
