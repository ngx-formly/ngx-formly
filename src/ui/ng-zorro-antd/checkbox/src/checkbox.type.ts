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
      (ngModelChange)="to.change && to.change(field, $event)"
    >
      {{ to.label }}
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    templateOptions: {
      indeterminate: true,
      hideLabel: true,
    },
  };
}
