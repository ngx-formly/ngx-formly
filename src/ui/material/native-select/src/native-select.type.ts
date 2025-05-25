import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';

interface NativeSelectProps extends FormlyFieldProps, FormlyFieldSelectProps {}

export interface FormlyNativeSelectFieldConfig extends FormlyFieldConfig<NativeSelectProps> {
  type: 'native-select' | Type<FormlyFieldNativeSelect>;
}

@Component({
  selector: 'formly-field-mat-native-select',
  template: `
    <select
      matNativeControl
      [id]="id"
      [name]="field.name"
      [readonly]="props.readonly"
      [required]="required"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
      @if (props.placeholder) {
        <option [ngValue]="undefined">{{ props.placeholder }}</option>
      }
      @if (props.options | formlySelectOptions: field | async; as opts) {
        @for (opt of opts; track $index) {
          @if (!opt.group) {
            <option [ngValue]="opt.value" [disabled]="opt.disabled">
              {{ opt.label }}
            </option>
          } @else {
            <optgroup [label]="opt.label">
              @for (child of opt.group; track $index) {
                <option [ngValue]="child.value" [disabled]="child.disabled">
                  {{ child.label }}
                </option>
              }
            </optgroup>
          }
        }
      }
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldNativeSelect extends FieldType<FieldTypeConfig<NativeSelectProps>> {}
