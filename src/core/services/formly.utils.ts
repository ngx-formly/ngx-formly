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
 }
