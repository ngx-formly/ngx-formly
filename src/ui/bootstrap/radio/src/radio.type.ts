import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div
      *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
      class="form-check"
      [class.form-check-inline]="to.formCheck === 'inline'"
    >
      <input
        type="radio"
        [id]="id + '_' + i"
        class="form-check-input"
        [name]="field.name || id"
        [class.is-invalid]="showError"
        [attr.value]="option.value"
        [value]="option.value"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [attr.disabled]="option.disabled || formControl.disabled ? true : null"
      />
      <label class="form-check-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    templateOptions: {
      options: [],
      formCheck: 'default', // 'default' | 'inline'
    },
  };
}
