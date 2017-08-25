import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-validation-messages',
  template: `
    <ng-container #fieldComponent></ng-container>
    <div>
      <small class="text-muted text-danger" *ngIf="valid" role="alert" [id]="validationId"><formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message></small>
    </div>
  `,
})
export class FormlyWrapperValidationMessages extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  get validationId() {
    return this.field.id + '-message';
  }
}
