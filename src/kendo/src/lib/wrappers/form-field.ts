import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-kendo-form-field',
  template: `
    <label [for]="id" class="k-form-field">
      <span *ngIf="to.label && to.hideLabel !== true">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" [attr.aria-hidden]="isOsAndroid? false : true" class="k-required" aria-label="Required">*</span>
      </span>
      <ng-container #fieldComponent></ng-container>
    </label>

    <formly-validation-message
      *ngIf="showError"
      class="k-field-info k-required"
      [field]="field">
    </formly-validation-message>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {
  isOsAndroid = navigator.userAgent.includes('Android');
}
