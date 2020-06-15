import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-custom-input',
  template: ` <input [type]="type" [formControl]="formControl" [formlyAttributes]="field" /> `,
})
export class FormlyFieldCustomInput extends FieldType {
  get type() {
    return this.to.type || 'text';
  }
}
