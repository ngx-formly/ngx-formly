import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';

interface MultiCheckboxProps extends FormlyFieldProps {
  formCheck?: 'default' | 'inline' | 'switch' | 'inline-switch';
}

export interface FormlyMultiCheckboxFieldConfig extends FormlyFieldConfig<MultiCheckboxProps> {
  type: 'multicheckbox' | Type<FormlyFieldMultiCheckbox>;
}

@Component({
  selector: 'formly-field-multicheckbox',
  template: `
    <ng-template #fieldTypeTemplate>
      @let options = props.options | formlySelectOptions: field | async;
      @for (choice of optionSources(options); track choice; let i = $index) {
        @let option = options[i];
        <div
          class="form-check"
          [ngClass]="{
            'form-check-inline': props.formCheck === 'inline' || props.formCheck === 'inline-switch',
            'form-switch': props.formCheck === 'switch' || props.formCheck === 'inline-switch',
          }"
        >
          <input
            type="checkbox"
            [id]="id + '_' + i"
            class="form-check-input"
            [class.is-invalid]="showError"
            [value]="option.value"
            [checked]="isChecked(option)"
            [formlyAttributes]="field"
            [disabled]="formControl.disabled || option.disabled"
            [attr.aria-describedby]="id + '-formly-validation-error'"
            [attr.aria-invalid]="showError"
            (change)="onChange(option.value, $any($event.target).checked)"
          />
          <label class="form-check-label" [for]="id + '_' + i">
            {{ option.label }}
          </label>
        </div>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldMultiCheckbox extends FieldType<FieldTypeConfig<MultiCheckboxProps>> {
  protected readonly optionSources = FormlySelectOptionsPipe.ɵgetOptionSources;

  override defaultOptions = {
    props: {
      formCheck: 'default' as const, // 'default' | 'inline' | 'switch' | 'inline-switch'
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Checkbox values retain the arbitrary shapes accepted by the public API.
  onChange(value: any, checked: boolean) {
    this.formControl.markAsDirty();
    if (this.props.type === 'array') {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Checkbox values retain the arbitrary shapes accepted by the public API.
  isChecked(option: any) {
    const value = this.formControl.value;

    return value && (this.props.type === 'array' ? value.indexOf(option.value) !== -1 : value[option.value]);
  }
}
