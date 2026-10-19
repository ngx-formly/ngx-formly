import { EventEmitter } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, AbstractControl, FormControl } from '@angular/forms';
import { getKeyPath, getField, getFieldValue, isNil, defineHiddenProp, observe, hasKey } from '../../utils';
import { FormlyFieldConfigCache } from '../../models';

export function unregisterControl(field: FormlyFieldConfigCache, emitEvent = false) {
  if (!hasKey(field) && field.fieldGroup) {
    field.fieldGroup.forEach((f) => unregisterControl(f, emitEvent));
    return;
  }
  if (field.shareFormControl === false) {
    field._controlActive = false;
  }
  const control = field.formControl;
  const fieldIndex = control._fields ? control._fields.indexOf(field) : -1;
  if (fieldIndex !== -1) {
    control._fields.splice(fieldIndex, 1);
  }

  const form = control.parent as FormlyFieldConfigCache['formControl'];
  if (!form) {
    return;
  }

  const opts = { emitEvent };
  if (form instanceof UntypedFormArray) {
    const key = form.controls.findIndex((c) => c === control);
    if (key !== -1) {
      form.removeAt(key, opts);
    }
  } else if (form instanceof UntypedFormGroup) {
    const paths = getKeyPath(field);
    const key = paths[paths.length - 1];
    if (form.get([key]) === control) {
      form.removeControl(key, opts);
    }
  }

  control.setParent(null);
  // A hidden row may have been attached only to hold a visible fixed-path editor.
  if (
    form instanceof UntypedFormGroup &&
    !Object.keys(form.controls).length &&
    !(form as FormlyFieldConfigCache['formControl'])._fields?.some((f) => !f._hide) &&
    form.parent
  ) {
    const key = Object.keys((form.parent as UntypedFormGroup).controls).find((key) => form.parent.get([key]) === form);
    unregisterControl({ key, formControl: form }, emitEvent);
  }
}

export function findControl(field: FormlyFieldConfigCache): AbstractControl {
  if (field.formControl) {
    return field.formControl;
  }

  if (field.shareFormControl === false) {
    return null;
  }

  // Hidden fields retain controls even when they are absent from the registered form tree.
  return findArrayControl(field.form, getKeyPath(field)) || field.form?.get(getKeyPath(field));
}

function findArrayControl(form: FormlyFieldConfigCache['formControl'], path: string[]) {
  for (const owner of form?._fields || []) {
    const target = owner.fieldArray && getField(owner, path);
    if (target?.formControl && target.shareFormControl !== false) {
      return target.formControl;
    }
  }
  return null;
}

function setControl(
  form: FormlyFieldConfigCache['formControl'],
  key: string,
  control: FormlyFieldConfigCache['formControl'],
  emitEvent: boolean,
) {
  const array = form._fields?.find((f) => f.fieldArray);
  if (form instanceof UntypedFormArray && array && control._fields?.every((f) => f.shareFormControl !== false)) {
    // Hidden rows compact the FormArray: insert relative to retained rows, without empty slots.
    const registered = new Set(form.controls);
    if (!registered.has(control)) {
      const index = array.fieldGroup.slice(0, Number(key)).filter((row, index) => {
        return registered.has((hasKey(row) ? row : getField(row, `${index}`))?.formControl);
      }).length;
      form.insert(index, control, { emitEvent });
    }
  } else if (form.get([key]) !== control) {
    (form as UntypedFormGroup).setControl(key, control, { emitEvent });
  }
}

export function registerControl(
  field: FormlyFieldConfigCache,
  control?: FormlyFieldConfigCache['formControl'],
  emitEvent = false,
) {
  control = control || field.formControl;

  if (field.shareFormControl === false && hasKey(field)) {
    if (!field.hasOwnProperty('_controlActive')) {
      defineHiddenProp(field, '_controlActive', false);
    } else {
      field._controlActive = false;
    }
  }

  if (!control._fields) {
    defineHiddenProp(control, '_fields', []);
  }
  if (control._fields.indexOf(field) === -1) {
    control._fields.push(field);
  }

  if (!field.formControl && control) {
    if (!Object.getOwnPropertyDescriptor(field, 'formControl')?.set) {
      defineHiddenProp(field, 'formControl', undefined);
      field.props.disabled = !!field.props.disabled;
      const disabledObserver = observe(field, ['props', 'disabled'], ({ firstChange, currentValue }) => {
        if (!firstChange && field.formControl) {
          currentValue ? field.formControl.disable() : field.formControl.enable();
        }
      });
      observe<AbstractControl>(field, ['formControl'], ({ previousValue, currentValue }) => {
        if (previousValue instanceof FormControl) {
          (previousValue as any)._unregisterOnDisabledChange(disabledObserver.setValue);
        }
        if (currentValue instanceof FormControl) {
          currentValue.registerOnDisabledChange(disabledObserver.setValue);
        }
      });
    }
    field.formControl = control;
    control.setValidators(null);
    control.setAsyncValidators(null);
  }

  if (!field.form || !hasKey(field)) {
    return;
  }

  let form: FormlyFieldConfigCache['formControl'] = field.form;
  const paths = getKeyPath(field);
  const value = getFieldValue(field);
  if (!(isNil(control.value) && isNil(value)) && control.value !== value && control instanceof FormControl) {
    control.patchValue(value, { emitEvent: field.shareFormControl !== false });
  }
  if (field._hide) {
    return;
  }

  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    const child = findArrayControl(form, [path]) || form.get([path]) || new UntypedFormGroup({});
    setControl(form, path, child, emitEvent);
    form = child;
  }

  const key = paths[paths.length - 1];
  if (!field._hide && form.get([key]) !== control) {
    if (field.shareFormControl === false) {
      const previous = form.get([key]) as FormlyFieldConfigCache['formControl'];
      previous?._fields?.forEach((f) => {
        if (f.shareFormControl === false) {
          f._controlActive = false;
        }
      });
      previous?.setParent(null);
    }
    setControl(form, key, control, emitEvent);
  }

  if (field.shareFormControl === false) {
    if (field.options?._formControlsForCheck) {
      field.options._formControlsForCheck.add(field);
    } else {
      field._controlActive = !field._hide && form.get([key]) === control;
    }
  }
}

export function updateValidity(c: AbstractControl, onlySelf = false) {
  const status = c.status;
  const value = c.value;
  c.updateValueAndValidity({ emitEvent: false, onlySelf });
  if (status !== c.status) {
    (c.statusChanges as EventEmitter<string>).emit(c.status);
  }

  if (value !== c.value) {
    (c.valueChanges as EventEmitter<any>).emit(c.value);
  }
}

export function clearControl(form: FormlyFieldConfigCache['formControl']) {
  delete form?._fields;
  form.setValidators(null);
  form.setAsyncValidators(null);
  if (form instanceof UntypedFormGroup || form instanceof UntypedFormArray) {
    Object.values(form.controls).forEach((c) => clearControl(c));
  }
}
