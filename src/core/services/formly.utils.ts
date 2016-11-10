import { FormlyFieldConfig } from '../components/formly.field.config';
import { Injectable } from '@angular/core';
@Injectable()
export class FormlyUtils {
  getFieldId(formId: string, options: FormlyFieldConfig, index: string|number) {
    if (options.id) return options.id;
    let type = options.type;
    if (!type && options.template) type = 'template';
    return [formId, type, options.key, index].join('_');
  }

  assignModelValue(model, path, value) {
    if (typeof path === 'string') {
      path = path.split('.');
    }

    if (path.length > 1) {
      const e = path.shift();
      if (!model[e]) {
        model[e] = isNaN(path[0]) ? {} : [];
      }
      this.assignModelValue(model[e], path, value);
    } else {
      model[path[0]] = value;
    }
  }

  reverseDeepMerge(dest, source = undefined) {
    let args = Array.prototype.slice.call(arguments);
    if (!args[1]) {
      return dest;
    }
    args.forEach((src, index) => {
      if (!index) {
        return;
      }
      for (let srcArg in src) {
        if (this.isNullOrUndefined(dest[srcArg]) || this.isBlankString(dest[srcArg])) {
          if (this.isFunction(src[srcArg])) {
            dest[srcArg] = src[srcArg];
          } else {
            dest[srcArg] = this.clone(src[srcArg]);
          }
        } else if (this.objAndSameType(dest[srcArg], src[srcArg])) {
          this.reverseDeepMerge(dest[srcArg], src[srcArg]);
        }
      }
    });
    return dest;
  }

  isNullOrUndefined(value) {
    return value === undefined || value === null;
  }

  isBlankString(value) {
    return value === '';
  }

  isFunction(value) {
    return typeof(value) === 'function';
  }

  objAndSameType(obj1, obj2) {
    return this.isObject(obj1) && this.isObject(obj2) &&
      Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2);
  }

  isObject(x) {
    return x != null && typeof x === 'object';
  }

  clone(value) {
    if (!this.isObject(value)) {
      return value;
    }
    return Array.isArray(value) ? value.slice(0) : Object.assign({}, value);
  }
}
