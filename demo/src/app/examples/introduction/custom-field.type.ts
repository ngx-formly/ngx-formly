import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-custom-input',
  template: ` <input [type]="type" [formControl]="formControl" [formlyAttributes]="field" /> `,
})
export class CustomFieldType extends FieldType<FieldTypeConfig> {
  get type() {
    return this.to.type || 'text';
  }
}
