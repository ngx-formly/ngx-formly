import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';

interface InputProps extends FormlyFieldProps {}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-mat-input',
  template: `
    @if (type !== 'number') {
      <input
        matInput
        [id]="id"
        [name]="field.name"
        [type]="type || 'text'"
        [readonly]="props.readonly"
        [required]="required"
        [errorStateMatcher]="errorStateMatcher"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [tabIndex]="props.tabindex"
        [placeholder]="props.placeholder"
      />
    } @else {
      <input
        matInput
        [id]="id"
        [name]="field.name"
        type="number"
        [readonly]="props.readonly"
        [required]="required"
        [errorStateMatcher]="errorStateMatcher"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [tabIndex]="props.tabindex"
        [placeholder]="props.placeholder"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {
  get type() {
    return this.props.type || 'text';
  }
}
