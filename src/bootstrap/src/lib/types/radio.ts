import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div>
      <div *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;"
        [ngClass]="{ 'form-check': to.formCheck !== 'custom', 'form-check-inline': to.formCheck === 'inline', 'custom-control custom-radio': to.formCheck === 'custom' }"
      >
        <input type="radio"
          [id]="id + '_' + i"
          [class.form-check-input]="to.formCheck !== 'custom'"
          [class.custom-control-input]="to.formCheck === 'custom'"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]="formControl"
          [formlyAttributes]="field">
        <label
          [class.form-check-label]="to.formCheck !== 'custom'"
          [class.custom-control-label]="to.formCheck === 'custom'"
          [for]="id + '_' + i">
          {{ option.label }}
        </label>
      </div>
    </div>
  `,
})
export class FormlyFieldRadio extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      formCheck: 'custom', // 'custom' | 'stacked' | 'inline'
    },
  };
}
