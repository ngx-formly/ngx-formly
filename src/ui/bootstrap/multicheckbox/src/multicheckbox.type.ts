import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <div
      *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
      class="form-check"
      [ngClass]="{
        'form-check-inline': to.formCheck === 'inline' || to.formCheck === 'inline-switch',
        'form-switch': to.formCheck === 'switch' || to.formCheck === 'inline-switch'
      }"
    >
      <input
        type="checkbox"
        [id]="id + '_' + i"
        class="form-check-input"
        [value]="option.value"
        [checked]="isChecked(option)"
        [formlyAttributes]="field"
        [disabled]="formControl.disabled || option.disabled"
        (change)="onChange(option.value, $any($event.target).checked)"
      />
      <label class="form-check-label" [for]="id + '_' + i">
        {{ option.label }}
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldMultiCheckbox extends FieldType<FieldTypeConfig> {
  defaultOptions = {
    templateOptions: {
      options: [],
      formCheck: 'default', // 'default' | 'inline' | 'switch' | 'inline-switch'
    },
  };

  onChange(value: any, checked: boolean) {
    if (this.to.type === 'array') {
      this.formControl.patchValue(
        checked
          ? [...(this.formControl.value || []), value]
          : [...(this.formControl.value || [])].filter((o) => o !== value),
      );
    } else {
      this.formControl.patchValue({ ...this.formControl.value, [value]: checked });
    }
    this.formControl.markAsTouched();
  }

  isChecked(option: any) {
    const value = this.formControl.value;

    return value && (this.to.type === 'array' ? value.indexOf(option.value) !== -1 : value[option.value]);
  }
}
