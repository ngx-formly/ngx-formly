import { Input, Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '../models';

export interface FieldTypeConfig extends FormlyFieldConfig {
  formControl: FormControl;
  templateOptions: NonNullable<Required<FormlyFieldConfig>['templateOptions']>;
}

export interface FieldGroupTypeConfig extends FormlyFieldConfig {
  formControl: FormGroup;
  templateOptions: NonNullable<Required<FormlyFieldConfig>['templateOptions']>;
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

  get to() {
    if (!!this.field.templateOptions) {
      return this.field.templateOptions as NonNullable<Required<F>['templateOptions']>;
    } else {
      return {} as NonNullable<Required<F>['templateOptions']>;
    }
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
