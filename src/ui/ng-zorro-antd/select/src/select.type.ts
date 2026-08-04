import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ng-zorro-antd/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  multiple?: boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-nz-select',
  template: `
    <nz-select
      [class.ng-dirty]="showError"
      [nzPlaceHolder]="props.placeholder"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [nzMode]="props.multiple ? 'multiple' : 'default'"
      (ngModelChange)="props.change && props.change(field, $event)"
    >
      @for (item of props.options | formlySelectOptions: field | async; track item) {
        @if (item.group) {
          <nz-option-group [nzLabel]="item.label">
            @for (child of item.group; track child) {
              <nz-option [nzValue]="child.value" [nzDisabled]="child.disabled" [nzLabel]="child.label"> </nz-option>
            }
          </nz-option-group>
        }
        @if (!item.group) {
          <nz-option [nzValue]="item.value" [nzDisabled]="item.disabled" [nzLabel]="item.label"></nz-option>
        }
      }
    </nz-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {}
