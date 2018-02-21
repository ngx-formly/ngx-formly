import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <label class="custom-control custom-checkbox">
      <input type="checkbox" [formControl]="formControl"
        [attr.invalid]="showError"
        [indeterminate]="to.indeterminate && model[key] === undefined"
        [formlyAttributes]="field" class="custom-control-input">
        <span class="custom-control-label">
          {{ to.label }}
          <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
        </span>
        <span class="custom-control-indicator"></span>
    </label>
  `,
})
export class FormlyFieldCheckbox extends FieldType {}
