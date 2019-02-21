import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, isNullOrUndefined } from '../utils';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyFieldConfig } from '../components/formly.field.config';
import { Inject, Optional } from '@angular/core';
import { FORMLY_CONFIG } from '../services/formly.config';

export abstract class FieldArrayType<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> {
  formControl: FormArray;

  // tslint:disable-next-line
  constructor(@Inject(FORMLY_CONFIG) @Optional() builder?: FormlyFormBuilder) {
    super();

    if (builder instanceof FormlyFormBuilder) {
      console.warn(`NgxFormly: passing 'FormlyFormBuilder' to '${this.constructor.name}' type is not required anymore, you may remove it!`);
    }
  }

  add(i?: number, initialModel?: any) {
    i = isNullOrUndefined(i) ? this.field.fieldGroup.length : i;
    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);

    (<any> this.options)._buildForm(true);
  }

  remove(i: number) {
    this.model.splice(i, 1);

    (<any> this.options)._buildForm(true);
  }
}
