import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '../../core/core';

@Component({
  selector: 'formly-wrapper-validation-messages',
  template: `
    <template #fieldComponent></template>
    <div>
      <small class="text-muted text-danger" *ngIf="valid"><formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message></small>
    </div>
  `,
})
export class FormlyWrapperValidationMessages extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
