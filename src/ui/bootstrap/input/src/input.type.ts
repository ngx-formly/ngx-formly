import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';

interface InputProps extends FormlyFieldProps {}

export interface FormlyInputFieldConfig extends FormlyFieldConfig<InputProps> {
  type: 'input' | Type<FormlyFieldInput>;
}

@Component({
  selector: 'formly-field-input',
  template: `
    <ng-template #fieldTypeTemplate>
      <input
        *ngIf="type !== 'number'; else numberTmp"
        [type]="type"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
        [attr.aria-describedby]="id + '-formly-validation-error'"
        [attr.aria-invalid]="showError"
      />
      <ng-template #numberTmp>
        <input
          type="number"
          [formControl]="formControl"
          class="form-control"
          [formlyAttributes]="field"
          [class.is-invalid]="showError"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        />
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig<InputProps>> {
  get type() {
    return this.props.type || 'text';
  }
}
