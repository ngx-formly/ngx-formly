import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-radio',
  template: `
    <p-radioButton
      *ngFor="let option of to.options | formlySelectOptions: field | async"
      [name]="field.name || id"
      [formControl]="formControl"
      [label]="option.label"
      [value]="option.value"
    >
    </p-radioButton>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType {
  defaultOptions = {
    templateOptions: { options: [] },
  };
}
