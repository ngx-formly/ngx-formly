import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-ion-form-field',
  template: `
    <div *ngIf="to.label && to.hideLabel !== true" class="ui-widget">
      <label [for]="id">
        {{ to.label }}
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
      </label>
    </div>
    <ng-container #fieldComponent></ng-container>

    <div class="ui-message ui-messages-error" *ngIf="showError">
        <formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message>
    </div>
  `,
  styles: [`
    .ui-messages-error {
      margin: 0;
      margin-top: 4px;
    }
  `],
})
export class FormlyWrapperFormField extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
}
