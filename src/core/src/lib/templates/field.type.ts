import { Input, Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '../models';

export interface FieldTypeConfig<T = FormlyFieldConfig['props']> extends FormlyFieldConfig<T> {
  formControl: FormControl;
  props: NonNullable<T>;
}

export interface FieldGroupTypeConfig<T = FormlyFieldConfig['props']> extends FormlyFieldConfig<T> {
  formControl: FormGroup;
  props: NonNullable<T>;
}

@Directive()
export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> {
  @Input() field: F;
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
    return this.field.formControl as F['formControl'];
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
    return this.options.formState || {};
  }
}
