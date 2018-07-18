import { FormlyFieldConfig } from './core';
import { Observable } from 'rxjs';

export function getFieldId(formId: string, field: FormlyFieldConfig, index: string|number) {
  if (field.id) return field.id;
  let type = field.type;
  if (!type && field.template) type = 'template';
  return [formId, type, field.key, index].join('_');
}

export function getKeyPath(field: {key?: string|string[], fieldGroup?: any, fieldArray?: any}): (string|number)[] {
  /* We store the keyPath in the field for performance reasons. This function will be called frequently. */
  if (!(<any> field)['_formlyKeyPath'] || (<any> field)['_formlyKeyPath'].key !== field.key) {
    let keyPath: (string|number)[] = [];
    if (field.key) {
      /* Also allow for an array key, hence the type check  */
      let pathElements = typeof field.key === 'string' ? field.key.split('.') : field.key;
      for (let pathElement of pathElements) {
        if (typeof pathElement === 'string') {
          /* replace paths of the form names[2] by names.2, cfr. angular formly */
          pathElement = pathElement.replace(/\[(\w+)\]/g, '.$1');
          keyPath = keyPath.concat(pathElement.split('.'));
        } else {
          keyPath.push(pathElement);
        }
      }
      for (let i = 0; i < keyPath.length; i++) {
        let pathElement = keyPath[i];
        if (typeof pathElement === 'string' && stringIsInteger(pathElement))  {
          keyPath[i] = parseInt(pathElement);
        }
      }
    }
    (<any> field)['_formlyKeyPath'] = {
      key: field.key,
      path: keyPath,
    };
  }

  return (<any> field)['_formlyKeyPath'].path.slice(0);
}

function stringIsInteger(str: string) {
  return !isNullOrUndefined(str) && /^\d+$/.test(str);
}

export const FORMLY_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];

export function getFieldModel(model: any, field: FormlyFieldConfig, constructEmptyObjects: boolean): any {
  let keyPath: (string|number)[] = getKeyPath(field);
  let value: any = model;
  for (let i = 0; i < keyPath.length; i++) {
    let path = keyPath[i];
    let pathValue = value[path];
    if (isNullOrUndefined(pathValue) && constructEmptyObjects) {
      if (i < keyPath.length - 1) {
        /* TODO? : It would be much nicer if we could construct object instances of the correct class, for instance by using factories. */
        value[path] = typeof keyPath[i + 1] === 'number' ? [] : {};
      } else if (field.fieldGroup && !field.fieldArray) {
        value[path] = {};
      } else if (field.fieldArray) {
        value[path] = [];
      }
    }
    value = value[path];
    if (!value) {
      break;
    }
  }
  return value;
}

export function assignModelToFields(fields: FormlyFieldConfig[], model: any) {
  fields.forEach((field, index) => {
    if (!isUndefined(field.defaultValue) && isUndefined(getValueForKey(model, field.key))) {
      assignModelValue(model, field.key, field.defaultValue);
    }

    (field as any).model = model;
    if (field.key && (field.fieldGroup || field.fieldArray)) {
      (field as any).model = getFieldModel(model, field, true);
    }

    if (field.fieldGroup) {
      assignModelToFields(field.fieldGroup, field.model);
    }
  });
}

export function assignModelValue(model: any, path: string | (string | number)[], value: any) {
  if (typeof path === 'string') {
    path = getKeyPath({key: path});
  }

  if (path.length > 1) {
    const e = path.shift();
    if (!model[e] || !isObject(model[e])) {
      model[e] = typeof path[0] === 'string' ? {} : [];
    }
    assignModelValue(model[e], path, value);
  } else {
    model[path[0]] = value;
  }
}

export function getValueForKey(model: any, path: string | (string | number)[]): any {
  if (typeof path === 'string') {
    path = getKeyPath({key: path});
  }
  if (path.length > 1) {
    const e = path.shift();
    if (!model[e]) {
      model[e] = typeof path[0] === 'string' ? {} : [];
    }
    return getValueForKey(model[e], path);
  } else {
    return model[path[0]];
  }
}

export function getKey(controlKey: string, actualKey: string) {
  return actualKey ? actualKey + '.' + controlKey : controlKey;
}

export function reverseDeepMerge(dest: any, ...args: any[]) {
  args.forEach(src => {
    for (let srcArg in src) {
      if (isNullOrUndefined(dest[srcArg]) || isBlankString(dest[srcArg])) {
        if (isFunction(src[srcArg])) {
          dest[srcArg] = src[srcArg];
        } else {
          dest[srcArg] = clone(src[srcArg]);
        }
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

export function clone(value: any): any {
  if (!isObject(value) || value instanceof RegExp || value instanceof Observable) {
    return value;
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.slice(0).map(v => clone(v));
  }

  value = Object.assign({}, value);
  Object.keys(value).forEach(k => value[k] = clone(value[k]));

  return value;
}

export function evalStringExpression(expression: string, argNames: string[]) {
  try {
    return Function(...argNames, `return ${expression};`) as any;
  } catch (error) {
    console.error(error);
  }
}

export function evalExpressionValueSetter(expression: string, argNames: string[]) {
  try {
    return Function(...argNames, `${expression} = expressionValue;`);
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
