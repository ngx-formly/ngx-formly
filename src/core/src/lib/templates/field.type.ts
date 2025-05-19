import { Input, Directive, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl, NgControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../models';

export interface FieldTypeConfig<T = FormlyFieldConfig['props']> extends FormlyFieldConfig<T> {
  formControl: UntypedFormControl;
  props: NonNullable<T>;
}

export interface FieldGroupTypeConfig<T = FormlyFieldConfig['props']> extends FormlyFieldConfig<T> {
  formControl: UntypedFormGroup;
  props: NonNullable<T>;
}

@Directive()
export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> {
  @ViewChildren(NgControl) set _formlyControls(controls: QueryList<NgControl>) {
    const f = this.field as FormlyFieldConfigCache;
    f._localFields = controls
      .map((c) => (c.control as FormlyFieldConfigCache['formControl'])._fields || [])
      .flat()
      .filter((f: FormlyFieldConfig) => f.formControl !== this.field.formControl);
  }

  @Input() field: F = {} as F;
  defaultOptions?: Partial<F>;

  get model() {
    return this.field.model;
  }

  get form() {
    return this.field.form;
  }

  get options() {
    return this.field.options;
  }

  get key() {
    return this.field.key;
  }

  get formControl() {
    return this.field.formControl as NonNullable<F['formControl']>;
  }

  get props() {
    return (this.field.props || {}) as NonNullable<F['props']>;
  }

  /** @deprecated Use `props` instead. */
  get to() {
    return this.props;
  }

  get showError(): boolean {
    return this.options.showError(this);
  }

  get id(): string {
    return this.field.id;
  }

  get formState() {
    return this.options?.formState || {};
  }
}
