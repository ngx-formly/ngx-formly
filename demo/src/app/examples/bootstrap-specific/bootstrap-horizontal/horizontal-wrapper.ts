import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

import { FormlyValidationMessage } from '@ngx-formly/core';

@Component({
  selector: 'formly-horizontal-wrapper',
  template: `
    <div class="row mb-3">
      @if (props.label) {
        <label [attr.for]="id" class="col-sm-2 col-form-label">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            *
          }
        </label>
      }
      <div class="col-sm-7">
        <ng-template #fieldComponent></ng-template>
      </div>

      @if (showError) {
        <div class="col-sm-3 invalid-feedback d-block">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
      }
    </div>
  `,
  imports: [FormlyValidationMessage],
})
export class FormlyHorizontalWrapper extends FieldWrapper {}
