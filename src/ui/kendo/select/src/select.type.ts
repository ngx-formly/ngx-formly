import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-select',
  template: `
    <kendo-dropdownlist
      [class.k-state-invalid]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [data]="to.options | formlySelectOptions: field | async"
      [textField]="'label'"
      [valueField]="'value'"
      [valuePrimitive]="true"
      (valueChange)="to.change && to.change(field, $event)"
    >
    </kendo-dropdownlist>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    templateOptions: { options: [] },
  };
}
