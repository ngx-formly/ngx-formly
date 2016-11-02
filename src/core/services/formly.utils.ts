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
 }
