import { Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormlyTemplateOptions, FormlyFieldConfig } from '../components/formly.field.config';

export abstract class Field {
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() model: any;
  @Input() options;

  get key() { return this.field.key; }
  get formControl(): AbstractControl { return this.field.formControl || this.form.get(this.key); }

  /**
   * @deprecated Use `to` instead.
   **/
  get templateOptions(): FormlyTemplateOptions {
    console.warn(`${this.constructor['name']}: 'templateOptions' is deprecated. Use 'to' instead.`);

    return this.to;
  }

  get to(): FormlyTemplateOptions { return this.field.templateOptions; }

  get valid(): boolean { return this.options.showError(this); }

  get id(): string { return this.field.id; }

  get formState() { return this.options.formState || {}; }
}
