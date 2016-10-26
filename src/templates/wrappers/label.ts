import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '../field.wrapper';

@Component({
  selector: 'formly-wrapper-label',
  template: `
    <div>
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
      <template #fieldComponent></template>
    </div>
  `,
})
export class FormlyWrapperLabel extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
