import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-fieldset',
  template: `
    <div class="form-group">
      <ng-template #fieldComponent></ng-template>
    </div>
  `,
})
export class FormlyWrapperFieldset extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
