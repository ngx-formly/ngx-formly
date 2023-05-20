import { Directive } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, assignFieldValue, getFieldValue, hasKey } from '../utils';
import { FormlyFieldConfig, FormlyExtension, FormlyFieldConfigCache } from '../models';
import { registerControl, unregisterControl, findControl } from '../extensions/field-form/utils';

export interface FieldArrayTypeConfig<T = FormlyFieldConfig['props']> extends FormlyFieldConfig<T> {
  formControl: FormArray;
  props: NonNullable<T>;
}

@Directive()
export abstract class FieldArrayType<F extends FormlyFieldConfig = FieldArrayTypeConfig>
  extends FieldType<F>
  implements FormlyExtension<F>
{
  onPopulate(field: F) {
    if (hasKey(field)) {
      const control = findControl(field);
      registerControl(field, control ? control : new FormArray([], { updateOn: field.modelOptions.updateOn }));
    }

    field.fieldGroup = field.fieldGroup || [];

    const length = Array.isArray(field.model) ? field.model.length : 0;
    if (field.fieldGroup.length > length) {
      for (let i = field.fieldGroup.length - 1; i >= length; --i) {
        unregisterControl(field.fieldGroup[i], true);
        field.fieldGroup.splice(i, 1);
      }
    }

    for (let i = field.fieldGroup.length; i < length; i++) {
      const f = {
        ...clone(typeof field.fieldArray === 'function' ? field.fieldArray(field) : field.fieldArray),
        key: `${i}`,
      };
      field.fieldGroup.push(f);
    }
  }

  add(i?: number, initialModel?: any, { markAsDirty } = { markAsDirty: true }) {
    i = i == null ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignFieldValue(this.field, []);
    }

    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
    this._build();
    markAsDirty && this.formControl.markAsDirty();
  }

  remove(i: number, { markAsDirty } = { markAsDirty: true }) {
    this.model.splice(i, 1);

    const field = this.field.fieldGroup[i];
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, key) => (f.key = `${key}`));
    unregisterControl(field, true);
    this._build();
    markAsDirty && this.formControl.markAsDirty();
  }

  private _build() {
    const fields = (this.field as FormlyFieldConfigCache).formControl._fields ?? [this.field];
    fields.forEach((f) => this.options.build(f));
    this.options.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: 'valueChanges',
    });
  }
}
