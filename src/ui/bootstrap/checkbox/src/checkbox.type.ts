import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <div
      class="form-check"
      [ngClass]="{
        'form-check-inline': to.formCheck === 'inline' || to.formCheck === 'inline-switch',
        'form-switch': to.formCheck === 'switch' || to.formCheck === 'inline-switch'
      }"
    >
      <input
        type="checkbox"
        [class.is-invalid]="showError"
        class="form-check-input"
        [class.position-static]="to.formCheck === 'nolabel'"
        [indeterminate]="to.indeterminate && formControl.value == null"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label *ngIf="to.formCheck !== 'nolabel'" [for]="id" class="form-check-label">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    templateOptions: {
      indeterminate: true,
      hideLabel: true,
      formCheck: 'default', // 'default' | 'inline' | 'switch' | 'inline-switch' | 'nolabel'
    },
  };
}
