import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

import { FormlyField, FormlyValidationMessage } from '@ngx-formly/core';

@Component({
  selector: 'formly-multi-schema-type',
  template: `
    <div class="card mb-3">
      <div class="card-body">
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
    </div>
  `,
  imports: [FormlyField, FormlyValidationMessage],
})
export class MultiSchemaTypeComponent extends FieldType {}
