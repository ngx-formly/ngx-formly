import { Inject, Optional } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, isNullOrUndefined, removeFieldControl } from '../utils';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyFieldConfig } from '../components/formly.field.config';
import { FORMLY_CONFIG, FormlyExtension } from '../services/formly.config';

export abstract class FieldArrayType<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> implements FormlyExtension {
  formControl: FormArray;
  defaultOptions: any = {
    defaultValue: [],
  };

  constructor(@Inject(FORMLY_CONFIG) @Optional() builder?: FormlyFormBuilder) {
    super();

    if (builder instanceof FormlyFormBuilder) {
      console.warn(`NgxFormly: passing 'FormlyFormBuilder' to '${this.constructor.name}' type is not required anymore, you may remove it!`);
    }
  }

  onPopulate(field: FormlyFieldConfig) {
    if (!field.parent) {
      return;
    }

    field.fieldGroup = field.fieldGroup || [];
    if (field.fieldGroup.length > field.model.length) {
      for (let i = field.fieldGroup.length; i >= field.model.length; --i) {
        removeFieldControl(field.formControl as FormArray, i);
        field.fieldGroup.splice(i, 1);
      }
    }

    for (let i = field.fieldGroup.length; i < field.model.length; i++) {
      const f = { ...clone(field.fieldArray), key: `${i}` };
      field.fieldGroup.push(f);
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
