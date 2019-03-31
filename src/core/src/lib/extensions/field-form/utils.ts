import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '../../core';
import { getKeyPath, getFieldValue, isNullOrUndefined } from '../../utils';

export function unregisterControl(field: FormlyFieldConfig) {
  const form = field.formControl.parent as FormArray | FormGroup;
  if (form instanceof FormArray) {
    const key = form.controls.findIndex(c => c === field.formControl);
    if (key !== -1) {
      form.removeAt(key);
      field.formControl.setParent(null);
    }
  } else if (form instanceof FormGroup) {
    const key = getKeyPath(field).pop();
    form.removeControl(`${key}`);
    field.formControl.setParent(null);
  }
}

export function registerControl(field: FormlyFieldConfig) {
  const paths = getKeyPath(field);
  const key = '' + paths.pop();

  let parent = field.parent.formControl as FormGroup;
  if (paths.length > 0) {
    paths.forEach((path) => {
      path = '' + path;
      if (!parent.get(path)) {
        registerControl({
          key: path,
          formControl: new FormGroup({}),
          model: typeof path === 'string' ? {} : [],
          parent: { formControl: parent },
        });
      }

      parent = <FormGroup> parent.get(path);
    });
  }

  const value = getFieldValue(field);
  const control = field.formControl;
  if (
    !(isNullOrUndefined(control.value) && isNullOrUndefined(value))
    && control.value !== value
    && control instanceof FormControl
  ) {
    control.patchValue(value, { emitEvent: false });
  }

  if (parent.get(key) !== control) {
    parent.setControl(key, control);
  }
}
