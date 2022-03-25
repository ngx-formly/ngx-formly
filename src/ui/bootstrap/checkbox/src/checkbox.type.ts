import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <div
      class="form-check"
      [ngClass]="{
        'form-check-inline': props.formCheck === 'inline' || props.formCheck === 'inline-switch',
        'form-switch': props.formCheck === 'switch' || props.formCheck === 'inline-switch'
      }"
    >
      <input
        type="checkbox"
        [class.is-invalid]="showError"
        class="form-check-input"
        [class.position-static]="props.formCheck === 'nolabel'"
        [indeterminate]="props.indeterminate && formControl.value == null"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label *ngIf="props.formCheck !== 'nolabel'" [for]="id" class="form-check-label">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    props: {
      indeterminate: true,
      hideLabel: true,
      formCheck: 'default', // 'default' | 'inline' | 'switch' | 'inline-switch' | 'nolabel'
    },
  };
}
