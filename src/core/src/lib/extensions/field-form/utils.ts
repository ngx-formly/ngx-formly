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
    const key = form.controls.findIndex(c => c === control);
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
  if (field['autoClear']) {
    if (field.parent.model) {
      delete field.parent.model[field.key];
    }
    control.reset(
      { value: undefined, disabled: control.disabled },
      { emitEvent: field.fieldGroup ? false : emitEvent, onlySelf: true },
    );
  }
}

export function findControl(field: FormlyFieldConfig): AbstractControl {
  if (field.formControl) {
    return field.formControl;
  }

  const form = field.parent.formControl as FormGroup;

  return form ? form.get(getKeyPath(field)) : null;
}

export function registerControl(field: FormlyFieldConfigCache, control?: any, emitEvent = false) {
  control = control || field.formControl;

  if (!control['_fields']) {
    defineHiddenProp(control, '_fields', []);
  }
  if (!control['_fields'].includes(field)) {
    control['_fields'].push(field);
  }

  if (!field.formControl && control) {
    defineHiddenProp(field, 'formControl', control);
    field.templateOptions.disabled = !!field.templateOptions.disabled;
    const changeFn = observe(field, ['templateOptions', 'disabled'], ({ firstChange, currentValue }) => {
      if (!firstChange) {
        currentValue ? field.formControl.disable() : field.formControl.enable();
      }
    });
    if (control.registerOnDisabledChange) {
      control.registerOnDisabledChange(changeFn);
    }
  }

  if (!field.form) {
    return;
  }

  let form = field.form;
  const paths = getKeyPath(field);
  if (!form['_formlyControls']) {
    defineHiddenProp(form, '_formlyControls', {});
  }
  form['_formlyControls'][paths.join('.')] = control;

  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    if (!form.get([path])) {
      registerControl({
        key: path,
        formControl: new FormGroup({}),
        form,
        parent: {},
      });
    }

    form = <FormGroup>form.get([path]);
  }

  if (field['autoClear'] && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
    assignFieldValue(field, field.defaultValue);
  }

  const value = getFieldValue(field);
  if (!(isNil(control.value) && isNil(value)) && control.value !== value && control instanceof FormControl) {
    control.patchValue(value, { emitEvent: false });
  }
  const key = paths[paths.length - 1];
  if (!field._hide && form.get([key]) !== control) {
    updateControl(form, { emitEvent }, () => (form as FormGroup).setControl(key, control));
  }
}

function updateControl(form: FormGroup | FormArray, opts: { emitEvent: boolean }, action: Function) {
  /**
   *  workaround for https://github.com/angular/angular/issues/27679
   */
  if (form instanceof FormGroup && !form['__patchForEachChild']) {
    defineHiddenProp(form, '__patchForEachChild', true);
    (form as any)._forEachChild = (cb: Function) => {
      Object.keys(form.controls).forEach(k => form.controls[k] && cb(form.controls[k], k));
    };
  }

  /**
   * workaround for https://github.com/angular/angular/issues/20439
   */
  const updateValueAndValidity = form.updateValueAndValidity.bind(form);
  if (opts.emitEvent === false) {
    form.updateValueAndValidity = opts => {
      updateValueAndValidity({ ...(opts || {}), emitEvent: false });
    };
  }

  action();

  if (opts.emitEvent === false) {
    form.updateValueAndValidity = updateValueAndValidity;
  }
}
