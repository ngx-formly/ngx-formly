import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { AbstractControl, FormGroup } from '@angular/forms';
import {
  ɵreverseDeepMerge as reverseDeepMerge,
  ɵgetFieldInitialValue as getFieldInitialValue,
  ɵclone as clone,
} from '@ngx-formly/core';
import { tap } from 'rxjs/operators';

export interface FormlyJsonschemaOptions {
  /**
   * allows to intercept the mapping, taking the already mapped
   * formly field and the original JSONSchema source from which it
   * was mapped.
   */
  map?: (mappedField: FormlyFieldConfig, mapSource: JSONSchema7) => FormlyFieldConfig;
}

// https://stackoverflow.com/a/27865285
function decimalPlaces(a: number) {
  if (!isFinite(a)) {
    return 0;
  }

  let e = 1, p = 0;
  while (Math.round(a * e) / e !== a) { e *= 10; p++; }

  return p;
}

function isEmpty(v: any) {
  return v === '' || v === undefined || v === null;
}

function isObject(v: any) {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

function isConst(schema: JSONSchema7) {
  return schema.hasOwnProperty('const') || (schema.enum && schema.enum.length === 1);
}

function totalMatchedFields(field: FormlyFieldConfig): number {
  if (!field.fieldGroup) {
    return field.key && getFieldInitialValue(field) !== undefined ? 1 : 0;
  }

  const total = field.fieldGroup.reduce((s, f) => totalMatchedFields(f) + s, 0);
  return total === 0
    ? field.key && getFieldInitialValue(field) !== undefined ? 1 : 0
    : total;
}

interface IOptions extends FormlyJsonschemaOptions {
  schema: JSONSchema7;
  resetOnHide?: boolean;
  shareFormControl?: boolean;
  ignoreDefault?: boolean;
  readOnly?: boolean;
  key?: FormlyFieldConfig['key'];
}

@Injectable({ providedIn: 'root' })
export class FormlyJsonschema {
  toFieldConfig(schema: JSONSchema7, options?: FormlyJsonschemaOptions): FormlyFieldConfig {
    return this._toFieldConfig(schema, { schema, ...(options || {}) });
  }

  private _toFieldConfig(schema: JSONSchema7, { key, ...options }: IOptions): FormlyFieldConfig {
    schema = this.resolveSchema(schema, options);

    let field: FormlyFieldConfig = {
      type: this.guessType(schema),
      defaultValue: schema.default,
      templateOptions: {
        label: schema.title,
        readonly: schema.readOnly,
        description: schema.description,
      },
    };

    if (key != null) {
      field.key = key;
    }

    if (!options.ignoreDefault && (schema.readOnly || options.readOnly)) {
      field.templateOptions.disabled = true;
      options = { ...options, readOnly: true };
    }

    if (options.resetOnHide) {
      field['resetOnHide'] = true;
    }

    if (options.shareFormControl === false) {
      field['shareFormControl'] = false;
    }

    if (options.ignoreDefault) {
      delete field.defaultValue;
    }

    switch (field.type) {
      case 'null': {
        this.addValidator(field, 'null', ({ value }) => value === null);
        break;
      }
      case 'number':
      case 'integer': {
        field.parsers = [v => isEmpty(v) ? (v === '' ? null : v) : Number(v)];
        if (schema.hasOwnProperty('minimum')) {
          field.templateOptions.min = schema.minimum;
        }

        if (schema.hasOwnProperty('maximum')) {
          field.templateOptions.max = schema.maximum;
        }

        if (schema.hasOwnProperty('exclusiveMinimum')) {
          field.templateOptions.exclusiveMinimum = schema.exclusiveMinimum;
          this.addValidator(field, 'exclusiveMinimum', ({ value }) => isEmpty(value) || (value > schema.exclusiveMinimum));
        }

        if (schema.hasOwnProperty('exclusiveMaximum')) {
          field.templateOptions.exclusiveMaximum = schema.exclusiveMaximum;
          this.addValidator(field, 'exclusiveMaximum', ({ value }) => isEmpty(value) || (value < schema.exclusiveMaximum));
        }

        if (schema.hasOwnProperty('multipleOf')) {
          field.templateOptions.step = schema.multipleOf;
          this.addValidator(field, 'multipleOf', ({ value }) => {
            if (isEmpty(value) || typeof value !== 'number' || value === 0 || schema.multipleOf <= 0) {
              return true;
            }

            // https://github.com/ajv-validator/ajv/issues/652#issue-283610859
            const multiplier = Math.pow(10, decimalPlaces(schema.multipleOf));
            return Math.round(value * multiplier) % Math.round(schema.multipleOf * multiplier) === 0;
          });
        }
        break;
      }
      case 'string': {
        const schemaType = schema.type as JSONSchema7TypeName;
        if (Array.isArray(schemaType) && (schemaType.indexOf('null') !== -1)) {
          field.parsers = [v => isEmpty(v) ? null : v];
        }

        ['minLength', 'maxLength', 'pattern'].forEach(prop => {
          if (schema.hasOwnProperty(prop)) {
            field.templateOptions[prop] = schema[prop];
          }
        });
        break;
      }
      case 'object': {
        field.fieldGroup = [];

        const [propDeps, schemaDeps] = this.resolveDependencies(schema);
        Object.keys(schema.properties || {}).forEach(property => {
          const f = this._toFieldConfig(<JSONSchema7> schema.properties[property], { ...options, key: property });
          field.fieldGroup.push(f);
          if (
            (Array.isArray(schema.required) && schema.required.indexOf(property) !== -1)
            || propDeps[property]
          ) {
            f.expressionProperties = {
              ...(f.expressionProperties || {}),
              'templateOptions.required': (m, s, f) => {
                let parent = f.parent;
                const model = f.fieldGroup && f.key != null ? parent.model : f.model;
                while (parent.key == null && parent.parent) {
                  parent = parent.parent;
                }

                const required = parent && parent.templateOptions ? parent.templateOptions.required : false;
                if (!model && !required) {
                  return false;
                }

                if (Array.isArray(schema.required) && schema.required.indexOf(property) !== -1) {
                  return true;
                }

                return propDeps[property] && (m && propDeps[property].some(k => !isEmpty(m[k])));
              },
            };
          }

          if (schemaDeps[property]) {
            const getConstValue = (s: JSONSchema7) => {
              return s.hasOwnProperty('const') ? s.const : s.enum[0];
            };

            const oneOfSchema = schemaDeps[property].oneOf;
            if (
              oneOfSchema
              && oneOfSchema.every(o => o.properties && o.properties[property] && isConst(o.properties[property]))
            ) {
              oneOfSchema.forEach(oneOfSchemaItem => {
                const { [property]: constSchema, ...properties } = oneOfSchemaItem.properties;
                field.fieldGroup.push({
                  ...this._toFieldConfig({ ...oneOfSchemaItem, properties }, { ...options, resetOnHide: true }),
                  hideExpression: m => !m || getConstValue(constSchema) !== m[property],
                });
              });
            } else {
              field.fieldGroup.push({
                ...this._toFieldConfig(schemaDeps[property], options),
                hideExpression: m => !m || isEmpty(m[property]),
              });
            }

          }
        });

        if (schema.oneOf) {
          field.fieldGroup.push(this.resolveMultiSchema(
            'oneOf',
            <JSONSchema7[]> schema.oneOf,
            { ...options, shareFormControl: false },
          ));
        }

        if (schema.anyOf) {
          field.fieldGroup.push(this.resolveMultiSchema(
            'anyOf',
            <JSONSchema7[]> schema.anyOf,
            options,
          ));
        }
        break;
      }
      case 'array': {
        if (schema.hasOwnProperty('minItems')) {
          field.templateOptions.minItems = schema.minItems;
          this.addValidator(field, 'minItems', ({ value }) => isEmpty(value) || (value.length >= schema.minItems));
        }
        if (schema.hasOwnProperty('maxItems')) {
          field.templateOptions.maxItems = schema.maxItems;
          this.addValidator(field, 'maxItems', ({ value }) => isEmpty(value) || (value.length <= schema.maxItems));
        }
        if (schema.hasOwnProperty('uniqueItems')) {
          field.templateOptions.uniqueItems = schema.uniqueItems;
          this.addValidator(field, 'uniqueItems', ({ value }) => {
            if (isEmpty(value) || !schema.uniqueItems) {
              return true;
            }

            const uniqueItems = Array.from(
              new Set(value.map((v: any) => JSON.stringify(v))),
            );

            return uniqueItems.length === value.length;
          });
        }

        // resolve items schema needed for isEnum check
        if (schema.items && !Array.isArray(schema.items)) {
          schema.items = this.resolveSchema(<JSONSchema7> schema.items, options);
        }

        // TODO: remove isEnum check once adding an option to skip extension
        if (!this.isEnum(schema)) {
          const _this = this;
          Object.defineProperty(field, 'fieldArray', {
            get: function () {
              if (schema.items && !Array.isArray(schema.items)) {
                // When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
                return _this._toFieldConfig(<JSONSchema7> schema.items, options);
              }

              const length = this.fieldGroup ? this.fieldGroup.length : 0;
              if (schema.items && schema.items[length]) {
                const f = _this._toFieldConfig(<JSONSchema7> schema.items[length], { ...options});
                f.templateOptions.removable = false;

                return f;
              }

              return schema.additionalItems
                ? _this._toFieldConfig(<JSONSchema7> schema.additionalItems, options)
                : {};
            },
            enumerable: true,
            configurable: true,
          });
        }

        break;
      }
    }

    if (schema.hasOwnProperty('const')) {
      field.templateOptions.const = schema.const;
      this.addValidator(field, 'const', ({ value }) => value === schema.const);
      if (!field.type) {
        field.defaultValue = schema.const;
      }
    }

    if (this.isEnum(schema)) {
      field.templateOptions.multiple = field.type === 'array';
      field.type = 'enum';
      field.templateOptions.options = this.toEnumOptions(schema);
    }

    // map in possible formlyConfig options from the widget property
    if (schema['widget'] && schema['widget'].formlyConfig) {
      field = this.mergeFields(field, schema['widget'].formlyConfig);
    }

    // if there is a map function passed in, use it to allow the user to
    // further customize how fields are being mapped
    return options.map ? options.map(field, schema) : field;
  }

  private resolveSchema(schema: JSONSchema7, options: IOptions) {
    if (schema && schema.$ref) {
      schema = this.resolveDefinition(schema, options);
    }

    if (schema && schema.allOf) {
      schema = this.resolveAllOf(schema, options);
    }

    return schema;
  }

  private resolveAllOf({ allOf, ...baseSchema }: JSONSchema7, options: IOptions) {
    if (!allOf.length) {
      throw Error(`allOf array can not be empty ${allOf}.`);
    }

    return allOf.reduce((base: JSONSchema7, schema: JSONSchema7) => {
      schema = this.resolveSchema(schema, options);
      if (base.required && schema.required) {
        base.required = [...base.required, ...schema.required];
      }

      if (schema.uniqueItems) {
        base.uniqueItems = schema.uniqueItems;
      }

      // resolve to min value
      ['maxLength', 'maximum', 'exclusiveMaximum', 'maxItems', 'maxProperties']
        .forEach(prop => {
          if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
            base[prop] = base[prop] < schema[prop] ? base[prop] : schema[prop];
          }
        });

      // resolve to max value
      ['minLength', 'minimum', 'exclusiveMinimum', 'minItems', 'minProperties']
        .forEach(prop => {
          if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
            base[prop] = base[prop] > schema[prop] ? base[prop] : schema[prop];
          }
        });

      return reverseDeepMerge(base, schema);
    }, baseSchema);
  }

  private resolveMultiSchema(
    mode: 'oneOf' | 'anyOf',
    schemas: JSONSchema7[],
    options: IOptions,
  ): FormlyFieldConfig {
    return {
      type: 'multischema',
      fieldGroup: [
        {
          type: 'enum',
          defaultValue: -1,
          templateOptions: {
            multiple: mode === 'anyOf',
            options: schemas
              .map((s, i) => ({ label: s.title, value: i, disabled: s.readOnly })),
          },
          hooks: {
            onInit: f => f.formControl.valueChanges.pipe(
              tap(() => (f.options as any)._checkField(f.parent)),
            ),
          },
        },
        {
          fieldGroup: schemas.map((s, i) => ({
            ...this._toFieldConfig(s, { ...options, resetOnHide: true }),
            hideExpression: (m, fs, f, forceUpdate?: boolean) => {
              const control = f.parent.parent.fieldGroup[0].formControl;
              if ((control.value === -1) || forceUpdate) {
                let value = f.parent.fieldGroup
                  .map((f, i) => [f, i] as [FormlyFieldConfig, number])
                  .filter(([f, i]) => {
                    return this.isFieldValid(f, schemas[i], options);
                  })
                  .sort(([f1], [f2]) => {
                    const matchedFields1 = totalMatchedFields(f1);
                    const matchedFields2 = totalMatchedFields(f2);
                    if (matchedFields1 === matchedFields2) {
                      if (f1.templateOptions.disabled === f2.templateOptions.disabled) {
                        return 0;
                      }

                      return f1.templateOptions.disabled ? 1 : -1;
                    }

                    return matchedFields2 > matchedFields1 ? 1 : -1;
                  })
                  .map(([, i]) => i)
                  ;

                if (mode === 'anyOf') {
                  const definedValue = value.filter(i => totalMatchedFields(f.parent.fieldGroup[i]));
                  value = definedValue.length > 0 ? definedValue : [value[0] || 0];
                }

                value = value.length > 0 ? value : [0];
                control.setValue(mode === 'anyOf' ? value : value[0]);
              }

              return Array.isArray(control.value)
                ? control.value.indexOf(i) === -1
                : control.value !== i;
            },
          })),
        },
      ],
    };
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
      ...['title', 'description', 'default', 'widget'].reduce((annotation, p) => {
        if (schema.hasOwnProperty(p)) {
          annotation[p] = schema[p];
        }

        return annotation;
      }, {}),
    };
  }

  private resolveDependencies(schema: JSONSchema7) {
    const deps = {};
    const schemaDeps = {};

    Object.keys(schema.dependencies || {}).forEach(prop => {
      const dependency = schema.dependencies[prop] as JSONSchema7;
      if (Array.isArray(dependency)) {
        // Property dependencies
        dependency.forEach(dep => {
          if (!deps[dep]) {
            deps[dep] = [prop];
          } else {
            deps[dep].push(prop);
          }
        });
      } else {
        // schema dependencies
        schemaDeps[prop] = dependency;
      }
    });

    return [deps, schemaDeps];
  }

  private guessType(schema: JSONSchema7) {
    const type = schema ? schema.type as JSONSchema7TypeName : null;
    if (!type && schema && schema.properties) {
      return 'object';
    }

    if (Array.isArray(type)) {
      if (type.length === 1) {
        return type[0];
      }

      if (type.length === 2 && type.indexOf('null') !== -1) {
        return type[type[0] === 'null' ? 1 : 0];
      }
    }

    return type;
  }

  private addValidator(field: FormlyFieldConfig, name: string, validator: (control: AbstractControl) => boolean) {
    field.validators = field.validators || {};
    field.validators[name] = validator;
  }

  private isEnum(schema: JSONSchema7) {
    return schema.enum
      || (schema.anyOf && schema.anyOf.every(isConst))
      || (schema.oneOf && schema.oneOf.every(isConst))
      || schema.uniqueItems && schema.items && !Array.isArray(schema.items) && this.isEnum(<JSONSchema7> schema.items);
  }

  private toEnumOptions(schema: JSONSchema7) {
    if (schema.enum) {
      return schema.enum.map(value => ({ value, label: value }));
    }

    const toEnum = (s: JSONSchema7) => {
      const value = s.hasOwnProperty('const') ? s.const : s.enum[0];
      const option: any = { value: value, label: s.title || value };
      if (s.readOnly) {
        option.disabled = true;
      }

      return option;
    };

    if (schema.anyOf) {
      return schema.anyOf.map(toEnum);
    }

    if (schema.oneOf) {
      return schema.oneOf.map(toEnum);
    }

    return this.toEnumOptions(<JSONSchema7> schema.items);
  }

  private isFieldValid(field: FormlyFieldConfig, schema: JSONSchema7, options: IOptions): boolean {
    const { form } = (field.options as any)._buildField({
      form: new FormGroup({}),
      fieldGroup: [this._toFieldConfig(schema, { ...options, resetOnHide: true, ignoreDefault: true, map: null })],
      model: field.model ? clone(field.model) : (field.fieldArray ? [] : {}),
    });

    return form.valid;
  }

  private mergeFields(f1: FormlyFieldConfig, f2: FormlyFieldConfig) {
    for (let prop in f2) {
      if (isObject(f1[prop]) && isObject(f2[prop])) {
        f1[prop] = this.mergeFields(f1[prop], f2[prop]);
      } else if (f2[prop] != null) {
        f1[prop] = f2[prop];
      }
    }

    return f1;
  }
}
