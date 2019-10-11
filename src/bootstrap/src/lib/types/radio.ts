import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div>
      <div *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;"
        [ngClass]="{ 'form-check': to.formCheck !== 'custom' && to.formCheck !== 'custom-inline', 'form-check-inline': to.formCheck === 'inline', 'custom-control custom-radio': to.formCheck === 'custom' || to.formCheck === 'custom-inline', 'custom-control-inline': to.formCheck === 'custom-inline' }"
      >
        <input type="radio"
          [id]="id + '_' + i"
          [class.form-check-input]="to.formCheck !== 'custom' && to.formCheck !== 'custom-inline'"
          [class.custom-control-input]="to.formCheck === 'custom' || to.formCheck === 'custom-inline'"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]="formControl"
          [formlyAttributes]="field">
        <label
          [class.form-check-label]="to.formCheck !== 'custom' && to.formCheck !== 'custom-inline'"
          [class.custom-control-label]="to.formCheck === 'custom' || to.formCheck === 'custom-inline'"
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
      formCheck: 'custom', // 'custom' | 'stacked' | 'inline' | 'custom-inline'
    },
  };
}
