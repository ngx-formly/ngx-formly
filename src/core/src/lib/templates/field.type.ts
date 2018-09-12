import { Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormlyTemplateOptions, FormlyFieldConfig, FormlyFormOptions } from '../components/formly.field.config';

 export abstract class FieldType {
  @Input() field: FormlyFieldConfig;

  @Input()
  get model() { return this.field.model; }
  set model(m: any) { console.warn(`NgxFormly: passing 'model' input to '${this.constructor.name}' component is not required anymore, you may remove it!`); }

  @Input()
  get form() { return <FormGroup> this.field.parent.formControl; }
  set form(form) { console.warn(`NgxFormly: passing 'form' input to '${this.constructor.name}' component is not required anymore, you may remove it!`); }

  @Input()
  get options() { return this.field.options; }
  set options(options: FormlyFormOptions) { console.warn(`NgxFormly: passing 'options' input to '${this.constructor.name}' component is not required anymore, you may remove it!`); }

  get key() { return this.field.key; }

  get formControl(): AbstractControl { return this.field.formControl; }

  get to(): FormlyTemplateOptions { return this.field.templateOptions; }

  get showError(): boolean { return this.options.showError(this); }

  get id(): string { return this.field.id; }

  get formState() { return this.options.formState || {}; }
}

/**
 * @deprecated use `FieldType` instead
 */
export abstract class Field extends FieldType {
  constructor() {
    super();
    console.warn(`NgxFormly: 'Field' has been renamed to 'FieldType', extend 'FieldType' instead.`);
  }
}
