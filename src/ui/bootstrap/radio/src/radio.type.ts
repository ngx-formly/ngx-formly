import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';
import { FormControl } from '@angular/forms';

interface RadioProps extends FormlyFieldProps {
  formCheck?: 'default' | 'inline';
}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-radio',
  template: `
    <ng-template #fieldTypeTemplate>
      <div
        *ngFor="let option of props.options | formlySelectOptions: field | async; let i = index"
        class="form-check"
        [class.form-check-inline]="props.formCheck === 'inline'"
      >
        <input
          type="radio"
          [id]="id + '_' + i"
          class="form-check-input"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]="option.disabled ? disabledControl : formControl"
          [formlyAttributes]="field"
        />
        <label class="form-check-label" [for]="id + '_' + i">
          {{ option.label }}
        </label>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  override defaultOptions = {
    props: {
      formCheck: 'default' as const,
    },
  };

  get disabledControl() {
    return new FormControl({ value: this.formControl.value, disabled: true });
  }
}
