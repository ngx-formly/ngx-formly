import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <div class="form-group" [class.has-error]="showError">
      <label *ngIf="to.label && to.hideLabel !== true" [attr.for]="id">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" [attr.aria-hidden]="isOsAndroid? false : true" aria-label="Required">*</span>
      </label>

      <ng-template #fieldComponent></ng-template>

      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <small *ngIf="to.description" class="form-text text-muted">{{ to.description }}</small>
    </div>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {
  isOsAndroid = navigator.userAgent.includes('Android');
}
