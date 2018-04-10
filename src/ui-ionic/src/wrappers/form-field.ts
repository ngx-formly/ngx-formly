import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-ion-form-field',
  template: `
    <ng-container #fieldComponent></ng-container>
    <ion-item no-lines *ngIf="showError">
      <p item-content ion-text color="danger">
        <formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message>
      </p>
    </ion-item>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
}
