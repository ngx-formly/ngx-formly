import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

import { FormlyField, FormlyValidationMessage } from '@ngx-formly/core';

@Component({
  selector: 'formly-object-type',
  template: `
    <div class="mb-3">
      @if (props.label) {
        <legend>{{ props.label }}</legend>
      }
      @if (props.description) {
        <p>{{ props.description }}</p>
      }
      @if (showError && formControl.errors) {
        <div class="alert alert-danger" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
      }
      @for (f of field.fieldGroup; track f) {
        <formly-field [field]="f"></formly-field>
      }
    </div>
  `,
  imports: [FormlyField, FormlyValidationMessage],
})
export class ObjectTypeComponent extends FieldType {}
