import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-horizontal-input-type',
  template: `<div class="row">
      <label attr.for="{{key}}" class="col-1 form-control-label">{{ to.label }}</label>
      <div class="col">
        <ng-template #fieldComponent></ng-template>
      </div>
    </div>`,
})
export class FormlyHorizontalWrapper extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
}
