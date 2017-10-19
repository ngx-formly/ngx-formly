import { Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormlyTemplateOptions, FormlyFieldConfig } from '../components/formly.field.config';

export abstract class Field {
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() model: any;
  @Input() options: any;

  get key() { return this.field.key; }

  get formControl(): AbstractControl { return this.field.formControl || this.form.get(this.key); }

  get to(): FormlyTemplateOptions { return this.field.templateOptions; }

  /**
   * @deprecated Use `showError` instead.
   **/
  get valid(): boolean {
    console.warn(`${this.constructor.name}: 'valid' is deprecated. Use 'showError' instead.`);

    return this.showError;
  }

  get showError(): boolean { return this.options.showError(this); }

  get id(): string { return this.field.id; }

  get formState() { return this.options.formState || {}; }
}
