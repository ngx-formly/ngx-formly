import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '../../../core';

@Component({
  selector: 'formly-wrapper-fieldset',
  template: `
    <div class="form-group" [ngClass]="{'has-danger': valid}">
      <ng-container #fieldComponent></ng-container>
    </div>
  `,
})
export class FormlyWrapperFieldset extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
