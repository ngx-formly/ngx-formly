import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';

@Injectable({ providedIn: 'root' })
export class FormlyJsonschema {
  toFieldConfig(jsonSchema: JSONSchema7): FormlyFieldConfig {
    return this._toFieldConfig(jsonSchema);
  }

  _toFieldConfig(jsonSchema: JSONSchema7, key?: string): FormlyFieldConfig {
    const field: FormlyFieldConfig = {
      ...(key ? { key } : {}),
      type: jsonSchema.type as JSONSchema7TypeName,
      defaultValue: jsonSchema.default,
      templateOptions: {
        minLength: jsonSchema.minLength,
        maxLength: jsonSchema.maxLength,
        label: jsonSchema.title,
        readonly: jsonSchema.readOnly,
        pattern: jsonSchema.pattern,
        description: jsonSchema.description,
      },
    };

    if (jsonSchema.enum) {
      if (field.type === 'integer' || field.type === 'number') {
        field.parsers = [Number];
      }
      field.type = 'enum';
      field.templateOptions.options = jsonSchema.enum;
      field.templateOptions.labelProp = item => item;
      field.templateOptions.valueProp = item => item;
    }

    switch (jsonSchema.type) {
      case 'object': {
        field.fieldGroup = [];
        Object.keys(jsonSchema.properties).forEach(p => {
          const child = this._toFieldConfig(jsonSchema.properties[p], p);
          if (Array.isArray(jsonSchema.required) && jsonSchema.required.indexOf(p) !== -1) {
            child.templateOptions.required = true;
          }
          field.fieldGroup.push(child);
        });
        break;
      }
      case 'array': {
        if (!Array.isArray(jsonSchema.items)) {
          field.fieldArray = this._toFieldConfig(jsonSchema.items as JSONSchema7);
        } else {
          field['_fieldArray'] = [];
          field.fieldGroup = [];
          jsonSchema.items.forEach(item => field['_fieldArray'].push(this._toFieldConfig(item)));
          if (jsonSchema.additionalItems) {
            field['_additionalFieldArray'] = this._toFieldConfig(jsonSchema.additionalItems);
          }

          Object.defineProperty(field, 'fieldArray', {
            get: () => {
              return field['_fieldArray'][field.fieldGroup.length] || field['_additionalFieldArray'];
            },
            enumerable: true,
            configurable: true,
          });
        }
        break;
      }
    }

    return field;
  }
}
