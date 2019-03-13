import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { ɵreverseDeepMerge as reverseDeepMerge } from '@ngx-formly/core';

export interface FormlyJsonschemaOptions {
  /**
   * allows to intercept the mapping, taking the already mapped
   * formly field and the original JSONSchema source from which it
   * was mapped.
   */
  map?: (mappedField: FormlyFieldConfig, mapSource: JSONSchema7) => FormlyFieldConfig;
}

@Injectable({ providedIn: 'root' })
export class FormlyJsonschema {
  toFieldConfig(jsonSchema: JSONSchema7, options?: FormlyJsonschemaOptions): FormlyFieldConfig {
    return this._toFieldConfig(jsonSchema, null, options);
  }

  _toFieldConfig(jsonSchema: JSONSchema7, key?: string, options?: FormlyJsonschemaOptions): FormlyFieldConfig {
    let field: FormlyFieldConfig = {
      ...(key ? { key } : {}),
      type: jsonSchema.type as JSONSchema7TypeName,
      defaultValue: jsonSchema.default,
      templateOptions: {
        min: jsonSchema.minimum,
        max: jsonSchema.maximum,
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
          const child = this._toFieldConfig(<JSONSchema7> jsonSchema.properties[p], p, options);
          if (Array.isArray(jsonSchema.required) && jsonSchema.required.indexOf(p) !== -1) {
            child.templateOptions.required = true;
          }
          field.fieldGroup.push(child);
        });
        break;
      }
      case 'array': {
        if (!Array.isArray(jsonSchema.items)) {
          field.fieldArray = this._toFieldConfig(jsonSchema.items as JSONSchema7, key, options);
        } else {
          field['_fieldArray'] = [];
          field.fieldGroup = [];
          jsonSchema.items.forEach(item => field['_fieldArray'].push(this._toFieldConfig(<JSONSchema7> item, key, options)));
          if (jsonSchema.additionalItems) {
            field['_additionalFieldArray'] = this._toFieldConfig(<JSONSchema7> jsonSchema.additionalItems, key, options);
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

    // map in possible formlyConfig options from the widget property
    if (jsonSchema['widget'] && jsonSchema['widget'].formlyConfig) {
      const widgetConfig = jsonSchema['widget'].formlyConfig;
      field = reverseDeepMerge(widgetConfig, field);
    }

    // if there is a map function passed in, use it to allow the user to
    // further customize how fields are being mapped
    if (options && options.map) {
      field = options.map(field, jsonSchema);
    }

    return field;
  }
}
