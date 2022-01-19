import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-checkbox',
  template: `
    <label
      nz-checkbox
      [nzIndeterminate]="to.indeterminate && formControl.value == null"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
      {{ to.label }}
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    templateOptions: {
      indeterminate: true,
      hideLabel: true,
    },
  };
}
