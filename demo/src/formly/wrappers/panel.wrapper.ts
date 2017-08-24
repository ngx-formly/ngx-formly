import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
@Component({
  selector: 'formly-wrapper-panel',
  template: `
    <div class="card">
      <h3 class="card-header">{{ to.title }}</h3>
      <div class="card-block">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `,
})
export class FormlyPanelWrapper extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
