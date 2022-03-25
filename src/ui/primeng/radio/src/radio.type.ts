import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-radio',
  template: `
    <div class="p-field-radiobutton" *ngFor="let option of props.options | formlySelectOptions: field | async">
      <p-radioButton
        [name]="field.name || id"
        [formControl]="formControl"
        [label]="option.label"
        [value]="option.value"
      >
      </p-radioButton>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig> {}
