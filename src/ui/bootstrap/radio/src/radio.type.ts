import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-radio',
  template: `
    <div>
      <div *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;"
        [ngClass]="{
          'form-check': to.formCheck.indexOf('custom') === -1,
          'form-check-inline': to.formCheck === 'inline',
          'custom-control custom-radio': to.formCheck.indexOf('custom') === 0,
          'custom-control-inline': to.formCheck === 'custom-inline'
        }"
      >
        <input
          type="radio"
          [id]="id + '_' + i"
          [class.form-check-input]="to.formCheck.indexOf('custom') === -1"
          [class.custom-control-input]="to.formCheck.indexOf('custom') === 0"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [attr.disabled]="option.disabled || formControl.disabled ? true : null"
        />
        <label
          [class.form-check-label]="to.formCheck.indexOf('custom') === -1"
          [class.custom-control-label]="to.formCheck.indexOf('custom') === 0"
          [for]="id + '_' + i">
        >
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
      formCheck: 'custom', // 'custom' | 'custom-inline' | 'stacked' | 'inline'
    },
  };
}
