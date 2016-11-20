import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '../../core/core';

@Component({
  selector: 'formly-wrapper-label',
  template: `
    <label [attr.for]="id" class="form-control-label">{{to.label}}</label>
    <template #fieldComponent></template>
  `,
})
export class FormlyWrapperLabel extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
