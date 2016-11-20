import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { FieldWrapper } from '../src/core/templates/field.wrapper';
@Component({
  selector: 'formly-wrapper-horizontal',
  template: `
    <div class="row">
      <label attr.for="{{key}}" class="col-sm-4 form-control-label">{{to.label}}</label>
      <div class="col-sm-8">
        <template #fieldComponent></template>
      </div>
    </div>
  `,
})
export class FormlyWrapperHorizontalLabel extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
