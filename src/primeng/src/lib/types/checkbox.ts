import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-checkbox',
  template: `
    <p-checkbox
      [class.ng-dirty]="showError"
      binary="true"
      [label]="to.label"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (valueChange)="to.change && to.change(field, $event)">
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
