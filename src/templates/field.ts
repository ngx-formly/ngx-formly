import {Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {FormlyTemplateOptions, FormlyFieldConfig} from '../components/formly.field.config';

export abstract class Field {
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() formModel: any;
  @Input() model: any;

  get key() { return this.field.key; }
  get formControl(): AbstractControl { return this.form.get(this.key); }
  get templateOptions(): FormlyTemplateOptions { return this.field.templateOptions; }
  get valid() { return this.formControl.touched && !this.formControl.valid; }
}
