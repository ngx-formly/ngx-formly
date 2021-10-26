import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-checkbox',
  template: `
    <input type="checkbox"
      class="k-checkbox"
      [class.k-state-invalid]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"/>

    <label [for]="id" class="k-checkbox-label">
      <span>
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" [attr.aria-hidden]="isOsAndroid? false : true" class="k-required" aria-label="Required">*</span>
      </span>
    </label>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  defaultOptions = {
    templateOptions: {
      hideLabel: true,
    },
  };

  isOsAndroid = navigator.userAgent.includes('Android');
}
