import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-horizontal-wrapper',
  template: `
    <div class="row mb-3">
      <label [attr.for]="id" class="col-sm-2 col-form-label" *ngIf="props.label">
        {{ props.label }}
        <ng-container *ngIf="props.required && props.hideRequiredMarker !== true">*</ng-container>
      </label>
      <div class="col-sm-7">
        <ng-template #fieldComponent></ng-template>
      </div>

      <div *ngIf="showError" class="col-sm-3 invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>
  `,
})
export class FormlyHorizontalWrapper extends FieldWrapper {}
