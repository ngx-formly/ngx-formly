import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {FieldWrapper} from '../field.wrapper';

@Component({
  selector: 'formly-wrapper-fieldset',
  template: `
    <div class="form-group" [ngClass]="{'has-danger': valid}">
      <template #fieldComponent></template>
    </div>
  `,
})
export class FormlyWrapperFieldset extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
