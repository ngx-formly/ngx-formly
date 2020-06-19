import { Input, Directive } from '@angular/core';
import { FormlyFieldConfig } from '../models';

@Directive()
export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> {
  @Input() field: F;
  defaultOptions?: F;

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
    return this.field.formControl;
  }

  get to() {
    return this.field.templateOptions || {};
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
