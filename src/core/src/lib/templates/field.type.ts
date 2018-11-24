import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '../components/formly.field.config';

export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> {
  @Input() field: F;
  defaultOptions?: F;

  @Input()
  get model() { return this.field.model; }
  set model(m: any) { console.warn(`NgxFormly: passing 'model' input to '${this.constructor.name}' component is not required anymore, you may remove it!`); }

  @Input()
  get form() { return <FormGroup> this.field.parent.formControl; }
  set form(form) { console.warn(`NgxFormly: passing 'form' input to '${this.constructor.name}' component is not required anymore, you may remove it!`); }

  @Input()
  get options(): F['options'] { return this.field.options; }
  set options(options: F['options']) { console.warn(`NgxFormly: passing 'options' input to '${this.constructor.name}' component is not required anymore, you may remove it!`); }

  get key() { return this.field.key; }

  get formControl(): F['formControl'] { return this.field.formControl; }

  get to(): F['templateOptions'] { return this.field.templateOptions; }

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
