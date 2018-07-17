import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-description',
  template: `
    <ng-template #fieldComponent></ng-template>
    <small *ngIf="to.description" class="form-text text-muted">{{ to.description }}</small>
  `,
})
export class FormlyWrapperDescription extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
