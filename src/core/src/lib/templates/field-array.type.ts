import { Directive } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, assignFieldValue, getFieldValue, hasKey } from '../utils';
import { FormlyFieldConfig, FormlyExtension, FormlyFieldConfigCache } from '../models';
import { registerControl, unregisterControl, findControl } from '../extensions/field-form/utils';

export interface FieldArrayTypeConfig<T = FormlyFieldConfig['props']> extends FormlyFieldConfig<T> {
  formControl: UntypedFormArray;
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
      registerControl(field, control ? control : new UntypedFormArray([], { updateOn: field.modelOptions.updateOn }));
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
      this.addArrayElement(field, i);
    }
  }

  add(i?: number, initialModel?: any, { markAsDirty } = { markAsDirty: true }) {
    markAsDirty && this.formControl.markAsDirty();
    i = i == null ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignFieldValue(this.field, []);
    }

    i = Math.trunc(i) || 0;
    i = i < 0 ? Math.max(this.model.length + i, 0) : Math.min(i, this.model.length);
    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
    const fields = (this.field as FormlyFieldConfigCache).formControl._fields ?? [this.field];
    fields.forEach((field) => {
      this.addArrayElement(field, i);
      field.fieldGroup.forEach((f, key) => this.updateArrayElementKey(f, `${key}`));
    });

    // Existing fields retain their controls and register them at their new keys.
    // Clear the shifted positions so the new field cannot reuse an existing control.
    const formControl = this.formControl;
    if (formControl instanceof UntypedFormArray) {
      for (let key = formControl.length - 1; key >= i; key--) {
        formControl.removeAt(key, { emitEvent: false });
      }
    } else {
      for (let key = this.field.fieldGroup.length - 2; key >= i; key--) {
        (formControl as UntypedFormGroup).removeControl(`${key}`, { emitEvent: false });
      }
    }

    this._build();
  }

  remove(i: number, { markAsDirty } = { markAsDirty: true }) {
    markAsDirty && this.formControl.markAsDirty();
    this.model.splice(i, 1);

    const field = this.field.fieldGroup[i];
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, key) => this.updateArrayElementKey(f, `${key}`));
    unregisterControl(field, true);
    this._build();
  }

  private _build() {
    const fields = (this.field as FormlyFieldConfigCache).formControl._fields ?? [this.field];
    fields.forEach((f) => (this.options as any).build(f));
    this.options.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: 'valueChanges',
    });
  }

  private addArrayElement(field: FormlyFieldConfig, index: number) {
    const f = { ...clone(typeof field.fieldArray === 'function' ? field.fieldArray(field) : field.fieldArray) };
    if (f.key !== null) {
      f.key = `${index}`;
    }

    field.fieldGroup.splice(index, 0, f);
  }

  private updateArrayElementKey(f: FormlyFieldConfig, newKey: string) {
    if (hasKey(f)) {
      f.key = newKey;
      return;
    }

    if (!f.fieldGroup?.length) {
      return;
    }

    for (let i = 0; i < f.fieldGroup.length; i++) {
      this.updateArrayElementKey(f.fieldGroup[i], newKey);
    }
  }
}
