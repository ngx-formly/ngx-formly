import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-checkbox',
  template: `
    <div class="p-field-checkbox">
      <p-checkbox
        [binary]="true"
        [label]="props.label"
        [formControl]="formControl"
        [formlyAttributes]="field"
        (onChange)="props.change && props.change(field, $event)"
      >
      </p-checkbox>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    props: {
      hideLabel: true,
    },
  };
}
