import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, isNullOrUndefined, assignModelValue, getKeyPath, getFieldValue } from '../utils';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../components/formly.field.config';
import { FormlyExtension } from '../services/formly.config';
import { registerControl, unregisterControl } from '../extensions/field-form/utils';

export abstract class FieldArrayType<F extends FormlyFieldConfig = FormlyFieldConfig> extends FieldType<F>
  implements FormlyExtension {
  formControl: FormArray;
  defaultOptions: any = {
    defaultValue: [],
  };

  onPopulate(field: FormlyFieldConfig) {
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

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.formControl) {
      return;
    }

    registerControl(
      field,
      new FormArray(field.fieldGroup.map(f => f.formControl), {
        validators: field._validators,
        asyncValidators: field._asyncValidators,
        updateOn: field.modelOptions.updateOn,
      }),
    );
  }

  add(i?: number, initialModel?: any) {
    i = isNullOrUndefined(i) ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignModelValue(this.field.parent.model, getKeyPath(this.field), []);
    }

    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
    this._buildField();
    this.formControl.markAsDirty();
  }

  remove(i: number) {
    this.model.splice(i, 1);
    unregisterControl(this.field.fieldGroup[i]);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, key) => (f.key = `${key}`));
    this._buildField();
    this.formControl.markAsDirty();
  }

  private _buildField() {
    (this.options as any)._buildField(this.field);
    this.options.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: 'valueChanges',
    });
  }
}
