import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div>
      <div *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;"
        [ngClass]="{ 'form-check': to.formCheck !== 'custom', 'form-check-inline': to.formCheck === 'inline', 'custom-control custom-checkbox': to.formCheck === 'custom' }"
      >
        <input type="checkbox"
          [id]="id + '_' + i"
          [class.form-check-input]="to.formCheck !== 'custom'"
          [class.custom-control-input]="to.formCheck === 'custom'"
          [value]="option.value"
          [checked]="formControl.value && (this.to.type === 'array' ? formControl.value.includes(option.value) : formControl.value[option.value])"
          [formlyAttributes]="field"
          (change)="onChange(option.value, $event.target.checked)">
        <label
          [class.form-check-label]="to.formCheck !== 'custom'"
          [class.custom-control-label]="to.formCheck === 'custom'"
          [for]="id + '_' + i">
          {{ option.label }}
        </label>
      </div>
    <div>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      formCheck: 'custom', // 'custom' | 'stacked' | 'inline'
    },
  };

  onChange(value: any, checked: boolean) {
    if (this.to.type === 'array') {
      this.formControl.patchValue(checked
        ? [...(this.formControl.value || []), value]
        : [...(this.formControl.value || [])].filter(o => o !== value),
      );
    } else {
      this.formControl.patchValue({ ...this.formControl.value, [value]: checked });
    }
    this.formControl.markAsTouched();
  }
}
