import { Inject, Optional } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, isNullOrUndefined, assignModelValue, getKeyPath } from '../utils';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../components/formly.field.config';
import { FORMLY_CONFIG, FormlyExtension } from '../services/formly.config';
import { registerControl } from '../extensions/field-form/utils';

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
    field.fieldGroup = field.fieldGroup || [];
    if (!field.model) {
      return;
    }

    if (field.fieldGroup.length > field.model.length) {
      for (let i = field.fieldGroup.length; i >= field.model.length; --i) {
        (field.formControl as FormArray).removeAt(i);
        field.fieldGroup.splice(i, 1);
      }
    }

    for (let i = field.fieldGroup.length; i < field.model.length; i++) {
      const f = { ...clone(field.fieldArray), key: `${i}` };
      field.fieldGroup.push(f);
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.formControl) {
      return;
    }

    registerControl(field, new FormArray(
      field.fieldGroup.map(f => f.formControl),
      {
        validators: field._validators,
        asyncValidators: field._asyncValidators,
        updateOn: field.modelOptions.updateOn,
      },
    ));
  }

  add(i?: number, initialModel?: any) {
    i = isNullOrUndefined(i) ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignModelValue(this.field.parent.model, getKeyPath(this.field), []);
    }

    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);

    (<any> this.options)._buildForm(true);
  }

  remove(i: number) {
    this.model.splice(i, 1);
    this.formControl.removeAt(i);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, key) => f.key = `${key}`);

    (<any> this.options)._buildForm(true);
  }
}
