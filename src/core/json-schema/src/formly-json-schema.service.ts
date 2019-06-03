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

function isEmpty(v) {
  return v === '' || v === undefined || v === null;
}

interface IOptions extends FormlyJsonschemaOptions {
  schema: JSONSchema7;
}

@Injectable({ providedIn: 'root' })
export class FormlyJsonschema {
  toFieldConfig(schema: JSONSchema7, options?: FormlyJsonschemaOptions): FormlyFieldConfig {
    return this._toFieldConfig(schema, { schema, ...(options || {}) });
  }

  private _toFieldConfig(schema: JSONSchema7, options: IOptions): FormlyFieldConfig {
    if (schema.$ref) {
      schema = this.resolveDefinition(schema, options);
    }

    let field: FormlyFieldConfig = {
      type: this.guessType(schema),
      defaultValue: schema.default,
      templateOptions: {
        label: schema.title,
        readonly: schema.readOnly,
        description: schema.description,
      },
    };

    switch (field.type) {
      case 'number':
      case 'integer': {
        field.parsers = [v => isEmpty(v) ? null : Number(v)];
        if (schema.hasOwnProperty('minimum')) {
          field.templateOptions.min = schema.minimum;
        }

        if (schema.hasOwnProperty('maximum')) {
          field.templateOptions.max = schema.maximum;
        }

        if (schema.hasOwnProperty('multipleOf')) {
          field.templateOptions.step = schema.multipleOf;
        }
        break;
      }
      case 'string': {
        ['minLength', 'maxLength', 'pattern'].forEach(prop => {
          if (schema.hasOwnProperty(prop)) {
            field.templateOptions[prop] = schema[prop];
          }
        });
        break;
      }
      case 'object': {
        field.fieldGroup = [];
        Object.keys(schema.properties || {}).forEach(key => {
          const f = this._toFieldConfig(<JSONSchema7> schema.properties[key], options);
          field.fieldGroup.push(f);
          f.key = key;
          if (Array.isArray(schema.required) && schema.required.indexOf(key) !== -1) {
            f.templateOptions.required = true;
          }
        });
        break;
      }
      case 'array': {
        field.fieldGroup = [];
        Object.defineProperty(field, 'fieldArray', {
          get: () => {
            if (!Array.isArray(schema.items)) {
              // When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
              return this._toFieldConfig(<JSONSchema7> schema.items, options);
            }

            const itemSchema = schema.items[field.fieldGroup.length]
              ? schema.items[field.fieldGroup.length]
              : schema.additionalItems;

            return itemSchema
              ? this._toFieldConfig(<JSONSchema7> itemSchema, options)
              : null;
          },
          enumerable: true,
          configurable: true,
        });
        break;
      }
    }

    if (schema.enum) {
      field.type = 'enum';
      field.templateOptions.options = schema.enum.map(value => ({ value, label: value }));
    }

    // map in possible formlyConfig options from the widget property
    if (schema['widget'] && schema['widget'].formlyConfig) {
      field = reverseDeepMerge(schema['widget'].formlyConfig, field);
    }

    // if there is a map function passed in, use it to allow the user to
    // further customize how fields are being mapped
    return options.map ? options.map(field, schema) : field;
  }

  private resolveDefinition(schema: JSONSchema7, options: IOptions): JSONSchema7 {
    const [uri, pointer] = schema.$ref.split('#/');
    if (uri) {
      throw Error(`Remote schemas for ${schema.$ref} not supported yet.`);
    }

    const definition = !pointer ? null : pointer.split('/').reduce(
      (def, path) => def && def.hasOwnProperty(path) ? def[path] : null,
      options.schema,
    );

    if (!definition) {
      throw Error(`Cannot find a definition for ${schema.$ref}.`);
    }

    if (definition.$ref) {
      return this.resolveDefinition(definition, options);
    }

    return {
      ...definition,
      ...['title', 'description', 'default'].reduce((annotation, p) => {
        if (schema.hasOwnProperty(p)) {
          annotation[p] = schema[p];
        }

        return annotation;
      }, {}),
    };
  }

  private guessType(schema: JSONSchema7) {
    const type = schema.type as JSONSchema7TypeName;
    if (!type && schema.properties) {
      return 'object';
    }

    return type;
  }
}
