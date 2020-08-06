import { FormlyFieldConfig } from './core';
import { isObservable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfigCache } from './components/formly.field.config';

export function getFieldId(formId: string, field: FormlyFieldConfig, index: string|number) {
  if (field.id) return field.id;
  let type = field.type;
  if (!type && field.template) type = 'template';
  return [formId, type, field.key, index].join('_');
}

export function getKeyPath(field: FormlyFieldConfigCache): string[] {
  if (!field.key) {
    return [];
  }

  /* We store the keyPath in the field for performance reasons. This function will be called frequently. */
  if (!field._keyPath || field._keyPath.key !== field.key) {
    let path: string[] = [];
    if (typeof field.key === 'string') {
      const key = field.key.indexOf('[') === -1
        ? field.key
        : field.key.replace(/\[(\w+)\]/g, '.$1');
      path = key.indexOf('.') !== -1 ? key.split('.') : [key];
    } else if (Array.isArray(field.key)) {
      path = field.key.slice(0);
    } else {
      path = [`${field.key}`];
    }

    field._keyPath = { key: field.key, path };
  }

  return field._keyPath.path.slice(0);
}

export const FORMLY_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];

export function assignFieldValue(field: FormlyFieldConfigCache, value: any) {
  let paths = getKeyPath(field);
  if (paths.length === 0) {
    return;
  }

  while (field.parent) {
    field = field.parent;
    paths = [...getKeyPath(field), ...paths];
  }

  if (value == null && field['autoClear'] && !field.formControl.parent) {
    const k = paths.pop();
    const m = paths.reduce((model, path) => model[path] || {}, field.parent.model);
    delete m[k];
    return;
  }

  assignModelValue(field.model, paths, value);
}

export function assignModelValue(model: any, paths: string[], value: any) {
  for (let i = 0; i < (paths.length - 1); i++) {
    const path = paths[i];
    if (!model[path] || !isObject(model[path])) {
      model[path] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }

    model = model[path];
  }

  model[paths[paths.length - 1]] = clone(value);
}

export function getFieldInitialValue(field: FormlyFieldConfig) {
  let value = field.options['_initialModel'];
  let paths = getKeyPath(field);
  while (field.parent) {
    field = field.parent;
    paths = [...getKeyPath(field), ...paths];
  }

  for (const path of paths) {
    if (!value) {
      return undefined;
    }
    value = value[path];
  }

  return value;
}

export function getFieldValue(field: FormlyFieldConfig): any {
  let model = field.parent.model;
  for (const path of getKeyPath(field)) {
    if (!model) {
      return model;
    }
    model = model[path];
  }

  return model;
}

export function reverseDeepMerge(dest: any, ...args: any[]) {
  args.forEach(src => {
    for (let srcArg in src) {
      if (isNullOrUndefined(dest[srcArg]) || isBlankString(dest[srcArg])) {
        dest[srcArg] = clone(src[srcArg]);
      } else if (objAndSameType(dest[srcArg], src[srcArg])) {
        reverseDeepMerge(dest[srcArg], src[srcArg]);
      }
    }
  });
  return dest;
}

export function isNullOrUndefined(value: any) {
  return value === undefined || value === null;
}

export function isUndefined(value: any) {
  return value === undefined;
}

export function isBlankString(value: any) {
  return value === '';
}

export function isFunction(value: any) {
  return typeof(value) === 'function';
}

export function objAndSameType(obj1: any, obj2: any) {
  return isObject(obj1) && isObject(obj2)
    && Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2)
    && !(Array.isArray(obj1) || Array.isArray(obj2));
}

export function isObject(x: any) {
  return x != null && typeof x === 'object';
}

export function isPromise(obj: any): obj is Promise<any> {
  return !!obj && typeof obj.then === 'function';
}

export function clone(value: any): any {
  if (
    !isObject(value)
    || isObservable(value)
    || /* instanceof SafeHtmlImpl */ value.changingThisBreaksApplicationSecurity
    || ['RegExp', 'FileList', 'File', 'Blob'].indexOf(value.constructor.name) !== -1
  ) {
    return value;
  }

  // https://github.com/moment/moment/blob/master/moment.js#L252
  if (value._isAMomentObject && isFunction(value.clone)) {
    return value.clone();
  }

  if (value instanceof AbstractControl) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.slice(0).map(v => clone(v));
  }

  // best way to clone a js object maybe
  // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
  const proto = Object.getPrototypeOf(value);
  let c = Object.create(proto);
  c = Object.setPrototypeOf(c, proto);
  // need to make a deep copy so we dont use Object.assign
  // also Object.assign wont copy property descriptor exactly
  return Object.keys(value).reduce((newVal, prop) => {
    const propDesc = Object.getOwnPropertyDescriptor(value, prop);
    if (propDesc.get) {
      Object.defineProperty(newVal, prop, propDesc);
    } else {
      newVal[prop] = clone(value[prop]);
    }

    return newVal;
  }, c);
}

export function defineHiddenProp(field: any, prop: string, defaultValue: any) {
  Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
  field[prop] = defaultValue;
}

export function wrapProperty<T = any>(
  o: any,
  prop: string,
  setFn: (change: {currentValue: T, previousValue?: T, firstChange: boolean}) => void,
) {
  if (!o._observers) {
    defineHiddenProp(o, '_observers', {});
  }

  if (!o._observers[prop]) {
    o._observers[prop] = [];
  }

  let fns: typeof setFn[] = o._observers[prop];
  if (fns.indexOf(setFn) === -1) {
    fns.push(setFn);
    setFn({ currentValue: o[prop], firstChange: true });
    if (fns.length === 1) {
      defineHiddenProp(o, `___$${prop}`, o[prop]);
      Object.defineProperty(o, prop, {
        configurable: true,
        get: () => o[`___$${prop}`],
        set: currentValue => {
          if (currentValue !== o[`___$${prop}`]) {
            const previousValue = o[`___$${prop}`];
            o[`___$${prop}`] = currentValue;
            fns.forEach(changeFn => changeFn({ previousValue, currentValue, firstChange: false }));
          }
        },
      });
    }
  }

  return () => fns.splice(fns.indexOf(setFn), 1);
}

export function reduceFormUpdateValidityCalls(form: any, action: Function) {
  const updateValidity = form._updateTreeValidity.bind(form);

  let updateValidityArgs = { called: false, emitEvent: false };
  form._updateTreeValidity = ({ emitEvent } = { emitEvent: true }) => updateValidityArgs = { called: true, emitEvent: emitEvent || updateValidityArgs.emitEvent };
  action();

  updateValidityArgs.called && updateValidity({ emitEvent: updateValidityArgs.emitEvent });
  form._updateTreeValidity = updateValidity;
}
