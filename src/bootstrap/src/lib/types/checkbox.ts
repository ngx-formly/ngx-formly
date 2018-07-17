import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <div class="custom-control custom-checkbox">
      <input class="custom-control-input" type="checkbox"
        [id]="id"
        [class.is-invalid]="showError"
        [indeterminate]="to.indeterminate && model[key] === undefined"
        [formControl]="formControl"
        [formlyAttributes]="field">
      <label class="custom-control-label" [for]="id">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>
    </div>
  `,
})
export class FormlyFieldCheckbox extends FieldType { }
