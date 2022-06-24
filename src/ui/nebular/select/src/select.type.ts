import { ChangeDetectionStrategy, Component, OnInit, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps, NebularCommonOptions } from '@ngx-formly/nebular/form-field';

interface SelectProps extends FormlyFieldProps, NebularCommonOptions {
  multiple?: boolean;
  isGroup?: boolean;
  filled?: boolean;
  hero?: boolean;
  selectedChange?: (field: FieldTypeConfig<SelectProps>, value: string) => void;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'formly-select-field',
  template: `
    <nb-select
      *ngIf="props.isGroup; else noGroup"
      [formControl]="formControl"
      [multiple]="props.multiple"
      [id]="id"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder"
      [required]="props.required"
      (selectedChange)="onSelectedChange($event)"
      [disabled]="props.disabled"
      [status]="props.status"
      [size]="props.size"
      [filled]="props.filled"
      [shape]="props.shape"
    >
      <nb-option-group *ngFor="let option of props.options | formlySelectOptions: field | async" [title]="option.label">
        <nb-option *ngFor="let opt of option.group" [value]="opt.value" [disabled]="opt.disabled">
          {{ opt.label }}
        </nb-option>
      </nb-option-group>
    </nb-select>
    <ng-template #noGroup>
      <nb-select
        [formControl]="formControl"
        [multiple]="props.multiple"
        [id]="id"
        [formlyAttributes]="field"
        [placeholder]="props.placeholder"
        [required]="props.required"
        (selectedChange)="onSelectedChange($event)"
        [disabled]="props.disabled"
        [status]="showError ? 'danger' : props.status"
        [size]="props.size"
        [filled]="props.filled"
        [shape]="props.shape"
      >
        <nb-option
          *ngFor="let opt of props.options | formlySelectOptions: field | async"
          [value]="opt.value"
          [disabled]="opt.disabled"
        >
          {{ opt.label }}
        </nb-option>
      </nb-select>
    </ng-template>
  `,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {
  override defaultOptions?: Partial<FieldTypeConfig<SelectProps>> = {
    props: {
      multiple: false,
      isGroup: false,
      status: 'info',
      size: 'medium',
      filled: false,
      hero: false,
      shape: 'rectangle',
    },
  };

  public onSelectedChange(value: string): void {
    if (this.props.selectedChange) {
      this.props.selectedChange(this.field, value);
    }
  }
}
