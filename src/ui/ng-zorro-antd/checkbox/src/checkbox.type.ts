import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-checkbox',
  template: `
    <label
      nz-checkbox
      [nzIndeterminate]="props.indeterminate && formControl.value == null"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (ngModelChange)="props.change && props.change(field, $event)"
    >
      {{ props.label }}
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    props: {
      indeterminate: true,
      hideLabel: true,
    },
  };
}
