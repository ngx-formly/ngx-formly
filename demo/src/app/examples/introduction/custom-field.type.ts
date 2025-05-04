import { Component } from '@angular/core';
import { FormlyAttributes, FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'formly-field-custom-input',
  template: ` <input [type]="type" [formControl]="formControl" [formlyAttributes]="field" /> `,
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes],
})
export class CustomFieldType extends FieldType<FieldTypeConfig> {
  get type() {
    return this.props.type || 'text';
  }
}
