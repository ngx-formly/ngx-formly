import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-ns-form-field',
  template: `
    <StackLayout class="form">
      <StackLayout class="input-field">
        <Label *ngIf="to.label && to.hideLabel !== true" class="label" [text]="to.label"></Label>
        <ng-container #fieldComponent></ng-container>
        <StackLayout class="hr-light"></StackLayout>
        <ng-container *ngIf="showError">
          <formly-validation-message #validationMessage [field]="field"></formly-validation-message>
          <Label class="text-danger" [text]="validationMessage.errorMessage"></Label>
        </ng-container>
      </StackLayout>
    </StackLayout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyWrapperFormField extends FieldWrapper {
  @ViewChild('validationMessage') validationMessage;
}
