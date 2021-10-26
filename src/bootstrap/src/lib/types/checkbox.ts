import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <div [ngClass]="{
      'form-check': to.formCheck.indexOf('custom') === -1,
      'form-check-inline': to.formCheck === 'inline',
      'custom-control': to.formCheck.indexOf('custom') === 0,
      'custom-checkbox': to.formCheck === 'custom' || to.formCheck === 'custom-inline',
      'custom-control-inline': to.formCheck === 'custom-inline',
      'custom-switch': to.formCheck === 'custom-switch'
    }">
      <input type="checkbox"
        [class.is-invalid]="showError"
        [class.form-check-input]="to.formCheck.indexOf('custom') === -1"
        [class.position-static]="to.formCheck === 'nolabel'"
        [class.custom-control-input]="to.formCheck.indexOf('custom') === 0"
        [indeterminate]="to.indeterminate && formControl.value === null"
        [formControl]="formControl"
        [formlyAttributes]="field">
      <label [for]="id"
        *ngIf="to.formCheck !== 'nolabel'"
        [class.form-check-label]="to.formCheck.indexOf('custom') === -1"
        [class.custom-control-label]="to.formCheck.indexOf('custom') === 0"
      >
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" [attr.aria-hidden]="isOsAndroid? false : true" aria-label="Required">*</span>
      </label>
    </div>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  defaultOptions = {
    templateOptions: {
      indeterminate: true,
      hideLabel: true,
      formCheck: 'custom', // 'custom' | 'custom-inline' | 'custom-switch' | 'stacked' | 'inline' | 'nolabel'
    },
  };

  isOsAndroid = navigator.userAgent.includes('Android');
}
