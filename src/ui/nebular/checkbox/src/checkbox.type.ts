import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps, NebularCommonOptions } from '@ngx-formly/nebular/form-field';

interface CheckboxProps extends FormlyFieldProps, Pick<NebularCommonOptions, 'status'> {
  indeterminate?: boolean;
  checkboxMessage?: string;
  checkChanged?: (checked: boolean) => void;
}

export interface FormlyCheckboxFieldConfig extends FormlyFieldConfig<CheckboxProps> {
  type: 'checkbox' | Type<FormlyFieldCheckbox>;
}

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <nb-checkbox
      [formControl]="formControl"
      [disabled]="props.disabled"
      [indeterminate]="props.indeterminate && formControl.value == null"
      [status]="showError ? 'danger' : props.status"
      (checkedChange)="onCheckedChange($event)"
    >
      {{ props.label }}
      <span class="required" *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
    </nb-checkbox>
  `,
  styles: [
    `
      .ng-star-inserted {
        color: red !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig<CheckboxProps>> {
  override defaultOptions?: Partial<FieldTypeConfig<CheckboxProps>> = {
    props: {
      disabled: false,
      indeterminate: true,
      checkboxMessage: '',
      status: 'info',
      hideLabel: true,
    },
  };

  get checkboxMessage(): string {
    return this.props.checkboxMessage;
  }

  onCheckedChange(checked: boolean) {
    if (this.props.checkChanged) {
      this.props.checkChanged(checked);
    }
  }
}
