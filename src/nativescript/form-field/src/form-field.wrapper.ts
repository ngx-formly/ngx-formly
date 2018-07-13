import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-ns-form-field',
  template: `
    <StackLayout>
      <Label *ngIf="to.label && to.hideLabel !== true" [text]="to.label"></Label>
      <ng-container #fieldComponent></ng-container>

      <ng-container *ngIf="showError">
        <formly-validation-message #validationMessage [field]="field"></formly-validation-message>
        <Label [text]="validationMessage.errorMessage"></Label>
      </ng-container>
    </StackLayout>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
  @ViewChild('validationMessage') validationMessage;
}
