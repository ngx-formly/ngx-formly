import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { FieldWrapper } from '../src/core/templates/field.wrapper';
@Component({
  selector: 'formly-wrapper-panel',
  template: `
    <div class="card">
      <h3 class="card-header">{{templateOptions.title}}</h3>
      <div class="card-block">
        <template #fieldComponent></template>
      </div>
    </div>
  `,
})
export class FormlyPanelWrapper extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
