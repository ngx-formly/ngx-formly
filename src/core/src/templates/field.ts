import { Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormlyTemplateOptions, FormlyFieldConfig, FormlyFormOptions } from '../components/formly.field.config';

export abstract class Field {
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() model: any;
  @Input() options: FormlyFormOptions;

  get key() { return this.field.key; }

  get formControl(): AbstractControl { return this.field.formControl; }

  get to(): FormlyTemplateOptions { return this.field.templateOptions; }

  get showError(): boolean { return this.options.showError(this); }

  get id(): string { return this.field.id; }

  get formState() { return this.options.formState || {}; }
}
