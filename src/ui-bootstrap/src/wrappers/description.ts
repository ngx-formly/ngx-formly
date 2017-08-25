import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-description',
  template: `
    <ng-container #fieldComponent></ng-container>
    <div>
      <small class="text-muted">{{ to.description }}</small>
    </div>
  `,
})
export class FormlyWrapperDescription extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
