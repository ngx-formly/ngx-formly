import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-checkbox',
  template: `
    <label nz-checkbox [formControl]="formControl" [formlyAttributes]="field">
      {{ to.label }}
    </label>
  `,
})
export class FormlyFieldCheckbox extends FieldType {
  defaultOptions = {
    templateOptions: {
      hideLabel: true,
    },
  };
}
