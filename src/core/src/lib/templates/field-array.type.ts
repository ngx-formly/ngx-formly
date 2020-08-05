import { Inject, Optional } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, isNullOrUndefined, assignFieldValue } from '../utils';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyFieldConfig } from '../components/formly.field.config';
import { FORMLY_CONFIG, FormlyExtension } from '../services/formly.config';
import { registerControl, unregisterControl, findControl } from '../extensions/field-form/utils';

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
    if (!field.formControl && field.key) {
      const control = findControl(field);
      registerControl(field, control ? control : new FormArray([], { updateOn: field.modelOptions.updateOn }));
    }

    field.fieldGroup = field.fieldGroup || [];

    const length = field.model ? field.model.length : 0;
    if (field.fieldGroup.length > length) {
      for (let i = field.fieldGroup.length - 1; i >= length; --i) {
        unregisterControl(field.fieldGroup[i]);
        field.fieldGroup.splice(i, 1);
      }
    }

    for (let i = field.fieldGroup.length; i < length; i++) {
      const f = { ...clone(field.fieldArray), key: `${i}` };
      field.fieldGroup.push(f);
    }
  }

  add(i?: number, initialModel?: any, { markAsDirty } = { markAsDirty: true }) {
    i = isNullOrUndefined(i) ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignFieldValue(this.field, []);
    }

    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);

    (<any> this.options)._buildForm(true);
    markAsDirty && this.formControl.markAsDirty();
  }

  remove(i: number, { markAsDirty } = { markAsDirty: true }) {
    this.model.splice(i, 1);
    unregisterControl(this.field.fieldGroup[i], true);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, key) => f.key = `${key}`);

    (<any> this.options)._buildForm(true);
    markAsDirty && this.formControl.markAsDirty();
  }
}
