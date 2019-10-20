import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '../../core';
import { getKeyPath, getFieldValue, isNullOrUndefined, defineHiddenProp, wrapProperty } from '../../utils';

export function unregisterControl(field: FormlyFieldConfig) {
  const form = field.formControl.parent as FormArray | FormGroup;
  if (form instanceof FormArray) {
    const key = form.controls.findIndex(c => c === field.formControl);
    if (key !== -1) {
      form.removeAt(key);
      field.formControl.setParent(null);
    }
  } else if (form instanceof FormGroup) {
    const paths = getKeyPath(field);
    const key = paths[paths.length - 1];
    if (form.get([key]) === field.formControl) {
      form.removeControl(key);
    }
    field.formControl.setParent(null);
  }
}

export function registerControl(field: FormlyFieldConfig, control?: any) {
  control = control || field.formControl;
  if (!field.formControl && control) {
    defineHiddenProp(field, 'formControl', control);

    field.templateOptions.disabled = !!field.templateOptions.disabled;
    wrapProperty(field.templateOptions, 'disabled', ({ firstChange, currentValue }) => {
      if (!firstChange) {
        currentValue ? field.formControl.disable() : field.formControl.enable();
      }
    });
    if (control.registerOnDisabledChange) {
      control.registerOnDisabledChange(
        (value: boolean) => field.templateOptions['___$disabled'] = value,
      );
    }
  }

  if (!field.form || !field.parent) {
    return;
  }

  let form = field.form;
  const paths = getKeyPath(field);
  for (let i = 0; i < (paths.length - 1); i++) {
    const path = paths[i];
    if (!form.get([path])) {
      registerControl({
        key: path,
        formControl: new FormGroup({}),
        form,
        parent: {},
      });
    }

    form = <FormGroup> form.get([path]);
  }

  const value = getFieldValue(field);
  if (
    !(isNullOrUndefined(control.value) && isNullOrUndefined(value))
    && control.value !== value
    && control instanceof FormControl
  ) {
    control.patchValue(value, { emitEvent: false });
  }
  const key = paths[paths.length - 1];
  if (form.get([key]) !== control) {
    form.setControl(key, control);
  }
}
