import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-primeng-form-field',
  template: `
    <div *ngIf="to.label && to.hideLabel !== true" class="ui-widget">
      <label [for]="id">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>
    </div>
    <ng-container #fieldComponent></ng-container>

    <div class="ui-message ui-widget ui-corner-all ui-message-error ui-messages-error" *ngIf="showError">
        <formly-validation-message class="ui-message-text" [field]="field"></formly-validation-message>
    </div>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {
}
