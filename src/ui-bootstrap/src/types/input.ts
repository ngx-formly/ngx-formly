import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  template: `
    <input [type]="type" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
  `,
  host: {
    // temporary fix until removing bootstrap 3 support.
    '[class.d-inline-flex]': 'to.addonLeft || to.addonRight',
    '[class.custom-file]': 'to.addonLeft || to.addonRight',
  },
})
export class FormlyFieldInput extends FieldType {
  get type() {
    return this.to.type || 'text';
  }
}
