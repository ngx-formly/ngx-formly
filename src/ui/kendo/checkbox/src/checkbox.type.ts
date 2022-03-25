import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/kendo/form-field';

@Component({
  selector: 'formly-field-kendo-checkbox',
  template: `
    <input type="checkbox" kendoCheckBox [formControl]="formControl" [formlyAttributes]="field" />
    <label [for]="id" class="k-checkbox-label">
      {{ props.label }}
      <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true" class="k-required">*</span>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./checkbox.type.scss'],
})
export class FormlyFieldCheckbox extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    props: {
      hideLabel: true,
    },
  };
}
