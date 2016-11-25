import { FormlyFieldConfig } from './core';

export function getFieldId(formId: string, options: FormlyFieldConfig, index: string|number) {
  if (options.id) return options.id;
  let type = options.type;
  if (!type && options.template) type = 'template';
  return [formId, type, options.key, index].join('_');
}

export function assignModelValue(model, path, value) {
  if (typeof path === 'string') {
    path = path.split('.');
  }

  if (path.length > 1) {
    const e = path.shift();
    if (!model[e]) {
      model[e] = isNaN(path[0]) ? {} : [];
    }
    assignModelValue(model[e], path, value);
  } else {
    model[path[0]] = value;
  }
}

export function reverseDeepMerge(dest, source = undefined) {
  let args = Array.prototype.slice.call(arguments);
  if (!args[1]) {
    return dest;
  }
  args.forEach((src, index) => {
    if (!index) {
      return;
    }
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

export function isNullOrUndefined(value) {
  return value === undefined || value === null;
}

export function isBlankString(value) {
  return value === '';
}

export function isFunction(value) {
  return typeof(value) === 'function';
}

export function objAndSameType(obj1, obj2) {
  return isObject(obj1) && isObject(obj2) &&
    Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2);
}

export function isObject(x) {
  return x != null && typeof x === 'object';
}

export function clone(value) {
  if (!isObject(value)) {
    return value;
  }
  return Array.isArray(value) ? value.slice(0) : Object.assign({}, value);
}

export function evalStringExpression(expression: string, argNames: string[]) {
  try {
    return Function.bind.apply(Function, [void 0].concat(argNames.concat(`return ${expression};`)))();
  } catch (error) {
    console.error(error);
  }
}

export function evalExpressionValueSetter(expression: string, argNames: string[]) {
  try {
    return Function.bind
      .apply(Function, [void 0].concat(argNames.concat(`${expression} = expressionValue;`)))();
  } catch (error) {
    console.error(error);
  }
}

export function evalExpression(expression: string | Function | boolean, thisArg: any, argVal: any[]): boolean {
  if (expression instanceof Function) {
    return expression.apply(thisArg, argVal);
  } else {
    return expression ? true : false;
  }
}
