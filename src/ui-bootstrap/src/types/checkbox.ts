import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <label class="custom-control custom-checkbox">
      <input type="checkbox" [formControl]="formControl"
        [attr.invalid]="showError"
        [indeterminate]="model[key] === undefined"
        [formlyAttributes]="field" class="custom-control-input">
        {{ to.label }}
        {{ to.required ? '*' : '' }}
        <span class="custom-control-indicator"></span>
    </label>
  `,
})
export class FormlyFieldCheckbox extends FieldType {}
