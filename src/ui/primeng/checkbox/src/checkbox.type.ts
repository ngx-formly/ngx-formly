import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-checkbox',
  template: `
    <p-checkbox
      binary="true"
      [label]="to.label"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (onChange)="to.change && to.change(field, $event)"
    >
    </p-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  defaultOptions = {
    templateOptions: {
      hideLabel: true,
    },
  };
}
