import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-select',
  template: `
    <p-dropdown
      [placeholder]="props.placeholder"
      [options]="props.options | formlySelectOptions: field | async"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [showClear]="!props.required"
      (onChange)="props.change && props.change(field, $event)"
    >
    </p-dropdown>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig> {}
