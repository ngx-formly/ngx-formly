import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div class="custom-control custom-checkbox" *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;">
      <input class="custom-control-input" type="checkbox"
        [id]="id + '_' + i"
        [value]="option.value"
        [checked]="formControl.value && (this.to.type === 'array' ? formControl.value.includes(option.value) : formControl.value[option.value])"
        [formlyAttributes]="field"
        (change)="onChange(option.value, $event.target.checked)">
      <label class="custom-control-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </div>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
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
