import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-checkbox',
  template: `
    <div class="p-field-checkbox">
      <p-checkbox
        [binary]="true"
        [label]="to.label"
        [formControl]="formControl"
        [formlyAttributes]="field"
        (onChange)="to.change && to.change(field, $event)"
      >
      </p-checkbox>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    templateOptions: {
      hideLabel: true,
    },
  };
}
