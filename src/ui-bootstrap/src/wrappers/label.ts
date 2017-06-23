import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '../../../core';

@Component({
  selector: 'formly-wrapper-label',
  template: `
    <label [attr.for]="id" class="form-control-label">{{ to.label }}</label>
    <ng-container #fieldComponent></ng-container>
  `,
})
export class FormlyWrapperLabel extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
