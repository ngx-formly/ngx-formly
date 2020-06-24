import { Directive } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, assignFieldValue, getFieldValue } from '../utils';
import { FormlyFieldConfig, FormlyExtension } from '../models';
import { registerControl, unregisterControl, findControl } from '../extensions/field-form/utils';
import { Directive } from '@angular/core';

@Directive()
export abstract class FieldArrayType<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F> implements FormlyExtension {
  get formControl() {
    return this.field.formControl as FormArray;
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
    unregisterControl(this.field.fieldGroup[i], true);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, key) => (f.key = `${key}`));
    this._build();
    markAsDirty && this.formControl.markAsDirty();
  }

  private _build() {
    this.options.build(this.field);
    this.options.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: 'valueChanges',
    });
  }
}
