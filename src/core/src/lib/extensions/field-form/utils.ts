import { EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import {
  getKeyPath,
  getFieldValue,
  isNil,
  defineHiddenProp,
  observe,
  assignFieldValue,
  isUndefined,
} from '../../utils';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../../models';

export function unregisterControl(field: FormlyFieldConfig, emitEvent = false) {
  const form = field.formControl.parent as FormArray | FormGroup;
  if (!form) {
    return;
  }

  const control = field.formControl;
  const opts = { emitEvent };
  if (form instanceof FormArray) {
    const key = form.controls.findIndex((c) => c === control);
    if (key !== -1) {
      updateControl(form, opts, () => form.removeAt(key));
    }
  } else if (form instanceof FormGroup) {
    const paths = getKeyPath(field);
    const key = paths[paths.length - 1];
    if (form.get([key]) === control) {
      updateControl(form, opts, () => form.removeControl(key));
    }
  }

  control.setParent(null);
}

export function findControl(field: FormlyFieldConfig): AbstractControl {
  if (field.formControl) {
    return field.formControl;
  }

  if (field['shareFormControl'] === false) {
    return null;
  }

  const form = field.parent.formControl as FormGroup;

  return form ? form.get(getKeyPath(field)) : null;
}

export function registerControl(field: FormlyFieldConfigCache, control?: any, emitEvent = false) {
  control = control || field.formControl;

  if (!control['_fields']) {
    defineHiddenProp(control, '_fields', []);
  }
  if (control['_fields'].indexOf(field) === -1) {
    control['_fields'].push(field);
  }

  if (!field.formControl && control) {
    defineHiddenProp(field, 'formControl', control);
    control.setValidators(null);
    control.setAsyncValidators(null);

    field.templateOptions.disabled = !!field.templateOptions.disabled;
    const disabledObserver = observe(field, ['templateOptions', 'disabled'], ({ firstChange, currentValue }) => {
      if (!firstChange) {
        currentValue ? field.formControl.disable() : field.formControl.enable();
      }
    });
    if (control.registerOnDisabledChange) {
      control.registerOnDisabledChange(disabledObserver.setValue);
    }
  }

  if (!field.form || !field.key) {
    return;
  }

  let form = field.form;
  const paths = getKeyPath(field);
  const value = getFieldValue(field);
  if (!(isNil(control.value) && isNil(value)) && control.value !== value && control instanceof FormControl) {
    control.patchValue(value, { emitEvent: false });
  }

  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    if (!form.get([path])) {
      updateControl(form, { emitEvent }, () => (form as FormGroup).setControl(path, new FormGroup({})));
    }

    form = <FormGroup>form.get([path]);
  }

  const key = paths[paths.length - 1];
  if (!field._hide && form.get([key]) !== control) {
    updateControl(form, { emitEvent }, () => (form as FormGroup).setControl(key, control));
  }
}

export function updateValidity(c: AbstractControl) {
  const status = c.status;
  c.updateValueAndValidity({ emitEvent: false });
  if (status !== c.status) {
    (c.statusChanges as EventEmitter<string>).emit(c.status);
  }
}

function updateControl(form: FormGroup | FormArray, opts: { emitEvent: boolean }, action: Function) {
  /**
   *  workaround for https://github.com/angular/angular/issues/27679
   */
  if (form instanceof FormGroup && !form['__patchForEachChild']) {
    defineHiddenProp(form, '__patchForEachChild', true);
    (form as any)._forEachChild = (cb: Function) => {
      Object.keys(form.controls).forEach((k) => form.controls[k] && cb(form.controls[k], k));
    };
  }

  /**
   * workaround for https://github.com/angular/angular/issues/20439
   */
  const updateValueAndValidity = form.updateValueAndValidity.bind(form);
  if (opts.emitEvent === false) {
    form.updateValueAndValidity = (opts) => {
      updateValueAndValidity({ ...(opts || {}), emitEvent: false });
    };
  }

  action();

  if (opts.emitEvent === false) {
    form.updateValueAndValidity = updateValueAndValidity;
  }
}

export function clearControl(form: AbstractControl) {
  form['_fields'] && delete form['_fields'];
  if (form instanceof FormGroup || form instanceof FormArray) {
    Object.keys(form.controls).forEach((k) => clearControl(form.controls[k]));
  }
}
