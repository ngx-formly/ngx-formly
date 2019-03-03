import { FormArray, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '../../core';
import { getKeyPath, getFieldValue, isNullOrUndefined } from '../../utils';

export function evalStringExpression(expression: string, argNames: string[]) {
  try {
    return Function(...argNames, `return ${expression};`) as any;
  } catch (error) {
    console.error(error);
  }
}

export function evalExpressionValueSetter(expression: string, argNames: string[]) {
  try {
    return Function(...argNames, `${expression} = expressionValue;`) as (value: any) => void;
  } catch (error) {
    console.error(error);
  }
}

export function evalExpression(expression: string | Function | boolean, thisArg: any, argVal: any[]): any {
  if (expression instanceof Function) {
    return expression.apply(thisArg, argVal);
  } else {
    return expression ? true : false;
  }
}

export function removeFieldControl(form: FormArray | FormGroup, field: FormlyFieldConfig) {
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

export function addFieldControl(parent: FormArray | FormGroup, field: FormlyFieldConfig) {
  const fieldModel = getFieldValue(field);
  if (
    !(isNullOrUndefined(field.formControl.value) && isNullOrUndefined(fieldModel))
    && field.formControl.value !== fieldModel
  ) {
    field.formControl.patchValue(fieldModel, { emitEvent: false });
  }

  const key = getKeyPath(field).pop();
  if (parent instanceof FormArray) {
    parent.insert(key as number, field.formControl);
  } else if (parent instanceof FormGroup) {
    parent.addControl(`${key}`, field.formControl);
  }
}
