import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  multiple?: boolean;
  compareWith?: (o1: any, o2: any) => boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-select',
  template: `
    <ng-template #fieldTypeTemplate>
      @if (props.multiple) {
        <select
          class="form-select"
          multiple
          [formControl]="formControl"
          [compareWith]="props.compareWith"
          [class.is-invalid]="showError"
          [formlyAttributes]="field"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        >
          @if (props.options | formlySelectOptions: field | async; as opts) {
            @for (opt of opts; track opt) {
              @if (!opt.group) {
                <option [ngValue]="opt.value" [disabled]="opt.disabled">
                  {{ opt.label }}
                </option>
              } @else {
                <optgroup [label]="opt.label">
                  @for (child of opt.group; track child) {
                    <option [ngValue]="child.value" [disabled]="child.disabled">
                      {{ child.label }}
                    </option>
                  }
                </optgroup>
              }
            }
          }
        </select>
      } @else {
        <select
          class="form-select"
          [formControl]="formControl"
          [compareWith]="props.compareWith"
          [class.is-invalid]="showError"
          [formlyAttributes]="field"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        >
          @if (props.placeholder) {
            <option [ngValue]="undefined">{{ props.placeholder }}</option>
          }
          @if (props.options | formlySelectOptions: field | async; as opts) {
            @for (opt of opts; track opt) {
              @if (!opt.group) {
                <option [ngValue]="opt.value" [disabled]="opt.disabled">
                  {{ opt.label }}
                </option>
              } @else {
                <optgroup [label]="opt.label">
                  @for (child of opt.group; track child) {
                    <option [ngValue]="child.value" [disabled]="child.disabled">
                      {{ child.label }}
                    </option>
                  }
                </optgroup>
              }
            }
          }
        </select>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {
  override defaultOptions = {
    props: {
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };
}
