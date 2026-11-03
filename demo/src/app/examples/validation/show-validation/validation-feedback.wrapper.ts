import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-validation-feedback-wrapper',
  template: `
    <ng-template #fieldComponent></ng-template>
    @if (showValidation && formControl.pending) {
      <div class="form-text">Checking availability…</div>
    } @else if (showValidation && formControl.valid) {
      <div class="valid-feedback d-block">Looks good!</div>
    }
  `,
})
export class FormlyValidationFeedbackWrapper extends FieldWrapper {}
