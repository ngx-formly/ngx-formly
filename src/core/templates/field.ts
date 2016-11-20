import { Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormlyTemplateOptions, FormlyFieldConfig } from '../components/formly.field.config';

export abstract class Field {
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() formModel: any;
  @Input() model: any;
  @Input() options;

  get key() { return this.field.key; }
  get formControl(): AbstractControl { return this.form.get(this.key); }

  /**
   * @deprecated Use `to` instead.
   **/
  get templateOptions(): FormlyTemplateOptions {
    console.warn(`${this.constructor['name']}: 'templateOptions' is deprecated. Use 'to' instead.`);

    return this.to;
  }

  get to(): FormlyTemplateOptions { return this.field.templateOptions; }

  get valid() { return this.formControl.touched && !this.formControl.valid; }

  get id() { return this.field.id; }
}
