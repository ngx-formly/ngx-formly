import { Component, ChangeDetectionStrategy, ViewChildren, QueryList, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';

interface MultiCheckboxProps extends FormlyFieldProps {
  labelPosition?: 'before' | 'after';
}

export interface FormlyMultiCheckboxFieldConfig extends FormlyFieldConfig<MultiCheckboxProps> {
  type: 'multicheckbox' | Type<FormlyFieldMultiCheckbox>;
}

@Component({
  selector: 'formly-field-mat-multicheckbox',
  template: `
    @for (option of props.options | formlySelectOptions: field | async; track $index; let i = $index) {
      <mat-checkbox
        [id]="id + '_' + i"
        [formlyAttributes]="field"
        [tabIndex]="props.tabindex"
        [color]="props.color"
        [labelPosition]="props.labelPosition"
        [checked]="isChecked(option)"
        [disabled]="formControl.disabled || option.disabled"
        (change)="onChange(option.value, $event.checked)"
      >
        {{ option.label }}
      </mat-checkbox>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'id',
  },
})
export class FormlyFieldMultiCheckbox extends FieldType<FieldTypeConfig<MultiCheckboxProps>> {
  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;

  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      color: 'accent' as const, // workaround for https://github.com/angular/components/issues/18465
    },
  };

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

  // TODO: find a solution to prevent scroll on focus
  override onContainerClick() {}

  isChecked(option: any) {
    const value = this.formControl.value;

    return value && (this.props.type === 'array' ? value.indexOf(option.value) !== -1 : value[option.value]);
  }
}
