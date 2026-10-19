import { Directive } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, assignFieldValue, getFieldValue, getField, getKeyPath, hasKey } from '../utils';
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
    // Connected arrays share a FormArray. A keyless array uses its parent's control, which it does not share.
    const fields = hasKey(this.field)
      ? (this.field as FormlyFieldConfigCache).formControl._fields.filter((f) => f === this.field || f.fieldArray)
      : [this.field];
    if (fields.some((field) => field.props.trackByIndex)) {
      this._build();
      return;
    }
    const fixedFields = this.detachFixedFields(fields);
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

    this._build(fixedFields);
  }

  remove(i: number, { markAsDirty } = { markAsDirty: true }) {
    markAsDirty && this.formControl.markAsDirty();
    this.model.splice(i, 1);

    const fields = hasKey(this.field)
      ? (this.field as FormlyFieldConfigCache).formControl._fields.filter((f) => f === this.field || f.fieldArray)
      : [this.field];
    const trackByIndex = fields.some((field) => field.props.trackByIndex);
    const fixedFields = trackByIndex ? [] : this.detachFixedFields(fields);
    fields.forEach((field) => {
      const index = trackByIndex ? field.fieldGroup.length - 1 : i;
      const [removed] = field.fieldGroup.splice(index, 1);
      field.fieldGroup.forEach((f, key) => this.updateArrayElementKey(f, `${key}`));
      unregisterControl(removed, true);
    });
    this._build(fixedFields);
  }

  private _build(fixedFields: FormlyFieldConfig[] = []) {
    const fields = (this.field as FormlyFieldConfigCache).formControl._fields ?? [this.field];
    fields.forEach((f) => (this.options as any).build(f));
    const getPath = (field: FormlyFieldConfig) => {
      const path: string[] = [];
      for (let parent = field; parent; parent = parent.parent) {
        path.unshift(...getKeyPath(parent));
      }
      return path;
    };
    fixedFields.forEach((field) => {
      const path = getPath(field).slice(getPath(this.field).length);
      const array = fields.find((f) => getField(f, path)) || this.field;
      const target = path.length ? getField(array, path) : array;
      if (target?.formControl) {
        registerControl(field, target.formControl);
      }
    });
    fixedFields.forEach((field) => {
      this.options.build(field);
      this.options.detectChanges(field);
    });
    this.options.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: 'valueChanges',
    });
  }

  private detachFixedFields(arrays: FormlyFieldConfig[]): FormlyFieldConfigCache[] {
    const fixedFields = new Set<FormlyFieldConfigCache>();
    const visited = new Set<FormlyFieldConfigCache['formControl']>();
    const visit = (control: FormlyFieldConfigCache['formControl']) => {
      if (!control || visited.has(control)) {
        return;
      }
      visited.add(control);
      if (control instanceof UntypedFormArray || control instanceof UntypedFormGroup) {
        Object.values(control.controls).forEach(visit);
      }
    };
    visit(this.formControl);
    const visitField = (field: FormlyFieldConfig) => {
      visit(field.formControl);
      field.fieldGroup?.forEach(visitField);
    };
    // Hidden rows retain controls that are no longer in the FormArray.
    arrays.forEach(visitField);
    const visitFixedFields = (field: FormlyFieldConfigCache) => {
      if (arrays.includes(field) || field.shareFormControl === false) {
        return;
      }
      if (hasKey(field) && visited.has(field.formControl)) {
        fixedFields.add(field);
      }
      field.fieldGroup?.forEach(visitFixedFields);
    };
    let root: FormlyFieldConfig = this.field;
    while (root.parent) {
      root = root.parent;
    }
    visitFixedFields(root);
    fixedFields.forEach((field) => {
      const control = field.formControl;
      const index = control._fields?.indexOf(field) ?? -1;
      if (index !== -1) {
        control._fields.splice(index, 1);
      }
      control.setValidators(null);
      control.setAsyncValidators(null);
      field.formControl = null;
    });

    return [...fixedFields];
  }

  private addArrayElement(field: FormlyFieldConfig, index: number) {
    // Factories use fieldGroup.length to select the schema for the new position.
    const tail = field.fieldGroup.splice(index);
    try {
      const f = { ...clone(typeof field.fieldArray === 'function' ? field.fieldArray(field) : field.fieldArray) };
      if (f.key !== null) {
        f.key = `${index}`;
      }

      field.fieldGroup.push(f);
    } finally {
      field.fieldGroup.push(...tail);
    }
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
