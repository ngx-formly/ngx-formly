import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-checkbox',
  template: `
    <div class="custom-control custom-checkbox">
      <input type="checkbox" [formControl]="formControl"
        [attr.invalid]="showError"
        [indeterminate]="to.indeterminate && model[key] === undefined"
        [formlyAttributes]="field" class="custom-control-input">
        <label class="custom-control-label" [attr.for]="id">
          {{ to.label }}
          {{ to.required ? '*' : '' }}
        </label>
    </div>
  `,
})
export class FormlyFieldCheckbox extends FieldType {}
