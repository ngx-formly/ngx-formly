import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-validation-messages',
  template: `
    <ng-template #fieldComponent></ng-template>
    <div *ngIf="showError">
      <small class="text-danger invalid-feedback" [style.display]="'block'" role="alert" [id]="validationId">
        <formly-validation-message [field]="field"></formly-validation-message>
      </small>
    </div>
  `,
})
export class FormlyWrapperValidationMessages extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  get validationId() {
    return this.field.id + '-message';
  }
}
