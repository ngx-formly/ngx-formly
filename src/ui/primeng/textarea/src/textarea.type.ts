import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/primeng/form-field';

type TextAreaProps = FormlyFieldProps;

export interface FormlyTextAreaFieldConfig extends FormlyFieldConfig<TextAreaProps> {
  type: 'textarea' | Type<FormlyFieldTextArea>;
}

@Component({
  selector: 'formly-field-primeng-textarea',
  template: ` <textarea [formControl]="formControl" [formlyAttributes]="field" pTextarea fluid></textarea> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig<TextAreaProps>> {}
