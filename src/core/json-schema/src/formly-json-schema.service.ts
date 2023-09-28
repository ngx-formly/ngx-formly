import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import {
  ɵreverseDeepMerge as reverseDeepMerge,
  ɵgetFieldValue as getFieldValue,
  ɵclone as clone,
  ɵhasKey as hasKey,
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

interface FormlyJSONSchema7 extends JSONSchema7 {
  widget?: { formlyConfig: FormlyFieldConfig };
}

// https://stackoverflow.com/a/27865285
function decimalPlaces(a: number) {
  if (!isFinite(a)) {
    return 0;
  }

  let e = 1,
    p = 0;
  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p++;
  }

  return p;
}

function isEmpty(v: any) {
  return v === '' || v == null;
}

function isObject(v: any) {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

function isInteger(value: any) {
  return Number.isInteger ? Number.isInteger(value) : typeof value === 'number' && Math.floor(value) === value;
}

function isConst(schema: JSONSchema7Definition) {
  return typeof schema === 'object' && (schema.hasOwnProperty('const') || (schema.enum && schema.enum.length === 1));
}

function totalMatchedFields(field: FormlyFieldConfig): number {
  if (!field.fieldGroup) {
    return hasKey(field) && getFieldValue(field) !== undefined ? 1 : 0;
  }

  const total = field.fieldGroup.reduce((s, f) => totalMatchedFields(f) + s, 0);
  if (total === 0 && hasKey(field)) {
    const value = getFieldValue(field);
    if (
      value === null ||
      (value !== undefined && ((field.fieldArray && Array.isArray(value)) || (!field.fieldArray && isObject(value))))
    ) {
      return 1;
    }
  }

  return total;
}

interface IOptions extends FormlyJsonschemaOptions {
  schema: FormlyJSONSchema7;
  resetOnHide?: boolean;
  shareFormControl?: boolean;
  ignoreDefault?: boolean;
  strict?: boolean;
  readOnly?: boolean;
  key?: FormlyFieldConfig['key'];
  isOptional?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FormlyJsonschema {
  toFieldConfig(schema: JSONSchema7, options?: FormlyJsonschemaOptions): FormlyFieldConfig {
    return this._toFieldConfig(schema, { schema, ...(options || {}) });
  }

  private _toFieldConfig(schema: FormlyJSONSchema7, { key, ...options }: IOptions): FormlyFieldConfig {
    schema = this.resolveSchema(schema, options);
    const types = this.guessSchemaType(schema);

    let field: FormlyFieldConfig & { shareFormControl?: boolean } = {
      type: types[0],
      defaultValue: schema.default,
      props: {
        label: schema.title,
        readonly: schema.readOnly,
        description: schema.description,
      },
    };

    if (key != null) {
      field.key = key;
    }

    if (!options.ignoreDefault && (schema.readOnly || options.readOnly)) {
      field.props.disabled = true;
      options = { ...options, readOnly: true };
    }

    if (options.resetOnHide) {
      field.resetOnHide = true;
    }

    if (key && options.strict) {
      this.addValidator(field, 'type', (c: AbstractControl, f: FormlyFieldConfig) => {
        const value = getFieldValue(f);
        if (value != null) {
          switch (field.type) {
            case 'string': {
              return typeof value === 'string';
            }
            case 'integer': {
              return isInteger(value);
            }
            case 'number': {
              return typeof value === 'number';
            }
            case 'object': {
              return isObject(value);
            }
            case 'array': {
              return Array.isArray(value);
            }
          }
        }

        return true;
      });
    }

    if (options.shareFormControl === false) {
      field.shareFormControl = false;
    }

    if (options.ignoreDefault) {
      delete field.defaultValue;
    }

    this.addValidator(field, 'type', {
      schemaType: types,
      expression: ({ value }: AbstractControl) => {
        if (value === undefined) {
          return true;
        }

        if (value === null && types.indexOf('null') !== -1) {
          return true;
        }

        switch (types[0]) {
          case 'null': {
            return typeof value === null;
          }
          case 'string': {
            return typeof value === 'string';
          }
          case 'integer': {
            return isInteger(value);
          }
          case 'number': {
            return typeof value === 'number';
          }
          case 'object': {
            return isObject(value);
          }
          case 'array': {
            return Array.isArray(value);
          }
        }

        return true;
      },
    });

    switch (field.type) {
      case 'number':
      case 'integer': {
        field.parsers = [(v: string | number) => (isEmpty(v) ? undefined : Number(v))];
        if (schema.hasOwnProperty('minimum')) {
          field.props.min = schema.minimum;
        }

        if (schema.hasOwnProperty('maximum')) {
          field.props.max = schema.maximum;
        }

        if (schema.hasOwnProperty('exclusiveMinimum')) {
          field.props.exclusiveMinimum = schema.exclusiveMinimum;
          this.addValidator(
            field,
            'exclusiveMinimum',
            ({ value }: AbstractControl) => isEmpty(value) || value > schema.exclusiveMinimum,
          );
        }

        if (schema.hasOwnProperty('exclusiveMaximum')) {
          field.props.exclusiveMaximum = schema.exclusiveMaximum;
          this.addValidator(
            field,
            'exclusiveMaximum',
            ({ value }: AbstractControl) => isEmpty(value) || value < schema.exclusiveMaximum,
          );
        }

        if (schema.hasOwnProperty('multipleOf')) {
          field.props.step = schema.multipleOf;
          this.addValidator(field, 'multipleOf', ({ value }: AbstractControl) => {
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
        field.parsers = [
          (v) => {
            if (types.indexOf('null') !== -1) {
              v = isEmpty(v) ? null : v;
            } else if (!field.props.required) {
              v = v === '' ? undefined : v;
            }

            return v;
          },
        ];

        ['minLength', 'maxLength', 'pattern'].forEach((prop) => {
          if (schema.hasOwnProperty(prop)) {
            field.props[prop] = (schema as any)[prop];
          }
        });
        break;
      }
      case 'object': {
        if (!field.fieldGroup) {
          field.fieldGroup = [];
        }

        const { propDeps, schemaDeps } = this.resolveDependencies(schema);
        Object.keys(schema.properties || {}).forEach((property) => {
          const isRequired = Array.isArray(schema.required) && schema.required.indexOf(property) !== -1;
          const f = this._toFieldConfig(<JSONSchema7>schema.properties[property], {
            ...options,
            key: property,
            isOptional: options.isOptional || !isRequired,
          });

          field.fieldGroup.push(f);
          if (isRequired || propDeps[property]) {
            f.expressions = {
              ...(f.expressions || {}),
              'props.required': (f) => {
                let parent = f.parent;
                const model = f.fieldGroup && f.key != null ? parent.model : f.model;
                while (parent.key == null && parent.parent) {
                  parent = parent.parent;
                }

                const required = parent && parent.props ? parent.props.required : false;
                if (!model && !required) {
                  return false;
                }

                if (Array.isArray(schema.required) && schema.required.indexOf(property) !== -1) {
                  return true;
                }

                return propDeps[property] && f.model && propDeps[property].some((k) => !isEmpty(f.model[k]));
              },
            };
          }

          if (schemaDeps[property]) {
            const getConstValue = (s: JSONSchema7) => {
              return s.hasOwnProperty('const') ? s.const : s.enum[0];
            };

            const oneOfSchema = schemaDeps[property].oneOf as JSONSchema7[];
            if (
              oneOfSchema &&
              oneOfSchema.every((o) => o.properties && o.properties[property] && isConst(o.properties[property]))
            ) {
              oneOfSchema.forEach((oneOfSchemaItem) => {
                const { [property]: constSchema, ...properties } = oneOfSchemaItem.properties;
                field.fieldGroup.push({
                  ...this._toFieldConfig(
                    { ...oneOfSchemaItem, properties },
                    { ...options, shareFormControl: false, resetOnHide: true },
                  ),
                  expressions: {
                    hide: (f) => !f.model || getConstValue(constSchema as JSONSchema7) !== f.model[property],
                  },
                });
              });
            } else {
              field.fieldGroup.push({
                ...this._toFieldConfig(schemaDeps[property], options),
                expressions: {
                  hide: (f) => !f.model || isEmpty(f.model[property]),
                },
              });
            }
          }
        });

        if (schema.oneOf) {
          field.fieldGroup.push(
            this.resolveMultiSchema('oneOf', <JSONSchema7[]>schema.oneOf, { ...options, shareFormControl: false }),
          );
        }

        if (schema.anyOf) {
          field.fieldGroup.push(this.resolveMultiSchema('anyOf', <JSONSchema7[]>schema.anyOf, options));
        }
        break;
      }
      case 'array': {
        if (schema.hasOwnProperty('minItems')) {
          field.props.minItems = schema.minItems;
          this.addValidator(field, 'minItems', (c: AbstractControl, f: FormlyFieldConfig) => {
            const value = getFieldValue(f);
            return isEmpty(value) || value.length >= schema.minItems;
          });

          if (!options.isOptional && schema.minItems > 0 && field.defaultValue === undefined) {
            field.defaultValue = Array.from(new Array(schema.minItems));
          }
        }
        if (schema.hasOwnProperty('maxItems')) {
          field.props.maxItems = schema.maxItems;
          this.addValidator(field, 'maxItems', (c: AbstractControl, f: FormlyFieldConfig) => {
            const value = getFieldValue(f);
            return isEmpty(value) || value.length <= schema.maxItems;
          });
        }
        if (schema.hasOwnProperty('uniqueItems')) {
          field.props.uniqueItems = schema.uniqueItems;
          this.addValidator(field, 'uniqueItems', (c: AbstractControl, f: FormlyFieldConfig) => {
            const value = getFieldValue(f);
            if (isEmpty(value) || !schema.uniqueItems) {
              return true;
            }

            const uniqueItems = Array.from(
              new Set(
                value.map((v: any) =>
                  JSON.stringify(v, (k, o) => {
                    if (isObject(o)) {
                      return Object.keys(v)
                        .sort()
                        .reduce((obj: any, key) => {
                          obj[key] = v[key];
                          return obj;
                        }, {});
                    }

                    return o;
                  }),
                ),
              ),
            );

            return uniqueItems.length === value.length;
          });
        }

        // resolve items schema needed for isEnum check
        if (schema.items && !Array.isArray(schema.items)) {
          schema.items = this.resolveSchema(<JSONSchema7>schema.items, options);
        }

        // TODO: remove isEnum check once adding an option to skip extension
        if (!this.isEnum(schema)) {
          field.fieldArray = (root: FormlyFieldConfig) => {
            const items = schema.items as JSONSchema7 | JSONSchema7[];
            if (!Array.isArray(items)) {
              if (!items) {
                return {};
              }

              const isMultiSchema = items.oneOf || items.anyOf;

              // When items is a single schema, the additionalItems keyword is meaningless, and it should not be used.
              const f = this._toFieldConfig(
                items,
                isMultiSchema ? { ...options, key: `${root.fieldGroup.length}` } : options,
              );

              if (isMultiSchema && !f.key) {
                f.key = null;
              }

              f.props.required = true;

              return f;
            }

            const length = root.fieldGroup ? root.fieldGroup.length : 0;
            const itemSchema = items[length] ? items[length] : schema.additionalItems;
            const f = itemSchema ? this._toFieldConfig(<JSONSchema7>itemSchema, options) : {};
            if (f.props) {
              f.props.required = true;
            }
            if (items[length]) {
              f.props.removable = false;
            }

            return f;
          };
        }
        break;
      }
    }

    if (schema.hasOwnProperty('const')) {
      field.props.const = schema.const;
      this.addValidator(field, 'const', ({ value }: AbstractControl) => value === schema.const);
      if (!field.type) {
        field.defaultValue = schema.const;
      }
    }

    if (this.isEnum(schema)) {
      const enumOptions = this.toEnumOptions(schema);
      const multiple = field.type === 'array';

      field.type = 'enum';
      field.props.multiple = multiple;
      field.props.options = enumOptions;

      const enumValues = enumOptions.map((o) => o.value);
      this.addValidator(field, 'enum', ({ value }: AbstractControl) => {
        if (value === undefined) {
          return true;
        }

        if (multiple) {
          return Array.isArray(value) ? value.every((o) => enumValues.includes(o)) : false;
        }

        return enumValues.includes(value);
      });
    }

    if (schema.oneOf && !field.type) {
      delete field.key;
      field.fieldGroup = [
        this.resolveMultiSchema('oneOf', <JSONSchema7[]>schema.oneOf, { ...options, key, shareFormControl: false }),
      ];
    }

    if (schema.oneOf && !field.type) {
      delete field.key;
      field.fieldGroup = [
        this.resolveMultiSchema('oneOf', <JSONSchema7[]>schema.oneOf, { ...options, key, shareFormControl: false }),
      ];
    }

    // map in possible formlyConfig options from the widget property
    if (schema.widget?.formlyConfig) {
      field = this.mergeFields(field, schema.widget.formlyConfig);
    }

    field.templateOptions = field.props;
    // if there is a map function passed in, use it to allow the user to
    // further customize how fields are being mapped
    return options.map ? options.map(field, schema) : field;
  }

  private resolveSchema(schema: JSONSchema7, options: IOptions): JSONSchema7 {
    if (schema && schema.$ref) {
      schema = this.resolveDefinition(schema, options);
    }

    if (schema && schema.allOf) {
      schema = this.resolveAllOf(schema, options);
    }

    return schema;
  }

  private resolveAllOf({ allOf, ...baseSchema }: FormlyJSONSchema7, options: IOptions) {
    if (!allOf.length) {
      throw Error(`allOf array can not be empty ${allOf}.`);
    }

    return (allOf as FormlyJSONSchema7[]).reduce((base: FormlyJSONSchema7, schema: FormlyJSONSchema7) => {
      schema = this.resolveSchema(schema, options);
      if (base.required && schema.required) {
        base.required = [...base.required, ...schema.required];
      }

      if (schema.uniqueItems) {
        base.uniqueItems = schema.uniqueItems;
      }

      // resolve to min value
      (
        ['maxLength', 'maximum', 'exclusiveMaximum', 'maxItems', 'maxProperties'] as (keyof FormlyJSONSchema7)[]
      ).forEach((prop) => {
        if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
          (base as any)[prop] = base[prop] < schema[prop] ? base[prop] : schema[prop];
        }
      });

      // resolve to max value
      (
        ['minLength', 'minimum', 'exclusiveMinimum', 'minItems', 'minProperties'] as (keyof FormlyJSONSchema7)[]
      ).forEach((prop) => {
        if (!isEmpty(base[prop]) && !isEmpty(schema[prop])) {
          (base as any)[prop] = base[prop] > schema[prop] ? base[prop] : schema[prop];
        }
      });

      return reverseDeepMerge(base, schema);
    }, baseSchema);
  }

  private resolveMultiSchema(mode: 'oneOf' | 'anyOf', schemas: JSONSchema7[], options: IOptions): FormlyFieldConfig {
    return {
      type: 'multischema',
      fieldGroup: [
        {
          type: 'enum',
          defaultValue: -1,
          props: {
            multiple: mode === 'anyOf',
            options: schemas.map((s, i) => ({ label: s.title, value: i, disabled: s.readOnly })),
          },
          hooks: {
            onInit: (f) => f.formControl.valueChanges.pipe(tap(() => f.options.detectChanges(f.parent))),
          },
        },
        {
          fieldGroup: schemas.map((s, i) => ({
            ...this._toFieldConfig(s, { ...options, resetOnHide: true }),
            expressions: {
              hide: (f, forceUpdate?: boolean) => {
                const control = f.parent.parent.fieldGroup[0].formControl;
                if (control.value === -1 || forceUpdate) {
                  let value = f.parent.fieldGroup
                    .map(
                      (f, i) =>
                        [f, i, this.isFieldValid(f, i, schemas, options)] as [FormlyFieldConfig, number, boolean],
                    )
                    .sort(([f1, , f1Valid], [f2, , f2Valid]) => {
                      if (f1Valid !== f2Valid) {
                        return f2Valid ? 1 : -1;
                      }

                      const matchedFields1 = totalMatchedFields(f1);
                      const matchedFields2 = totalMatchedFields(f2);
                      if (matchedFields1 === matchedFields2) {
                        if (f1.props.disabled === f2.props.disabled) {
                          return 0;
                        }

                        return matchedFields2 > matchedFields1 ? 1 : -1;
                      }

                      return matchedFields2 > matchedFields1 ? 1 : -1;
                    })
                    .map(([, i]) => i);

                  if (mode === 'anyOf') {
                    const definedValue = value.filter((i) => totalMatchedFields(f.parent.fieldGroup[i]));
                    value = definedValue.length > 0 ? definedValue : [value[0] || 0];
                  }

                  value = value.length > 0 ? value : [0];
                  control.setValue(mode === 'anyOf' ? value : value[0]);
                }

                return Array.isArray(control.value) ? control.value.indexOf(i) === -1 : control.value !== i;
              },
            },
          })),
        },
      ],
    };
  }

  private resolveDefinition(schema: FormlyJSONSchema7, options: IOptions): FormlyJSONSchema7 {
    const [uri, pointer] = schema.$ref.split('#/');
    if (uri) {
      throw Error(`Remote schemas for ${schema.$ref} not supported yet.`);
    }

    const definition = !pointer
      ? null
      : pointer
          .split('/')
          .reduce((def, path) => (def?.hasOwnProperty(path) ? (def as any)[path] : null), options.schema);

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
          annotation[p] = (schema as any)[p];
        }

        return annotation;
      }, {} as any),
    };
  }

  private resolveDependencies(schema: JSONSchema7) {
    const propDeps: { [id: string]: string[] } = {};
    const schemaDeps: { [id: string]: JSONSchema7 } = {};

    Object.keys(schema.dependencies || {}).forEach((prop) => {
      const dependency = schema.dependencies[prop] as JSONSchema7;
      if (Array.isArray(dependency)) {
        // Property dependencies
        dependency.forEach((dep) => {
          if (!propDeps[dep]) {
            propDeps[dep] = [prop];
          } else {
            propDeps[dep].push(prop);
          }
        });
      } else {
        // schema dependencies
        schemaDeps[prop] = dependency;
      }
    });

    return { propDeps, schemaDeps };
  }

  private guessSchemaType(schema: JSONSchema7) {
    const type = schema?.type;
    if (!type && schema?.properties) {
      return ['object'];
    }

    if (Array.isArray(type)) {
      if (type.length === 1) {
        return type;
      }

      if (type.length === 2 && type.indexOf('null') !== -1) {
        return type.sort((t1) => (t1 == 'null' ? 1 : -1));
      }

      return type;
    }

    return type ? [type] : [];
  }

  private addValidator(field: FormlyFieldConfig, name: string, validator: FormlyFieldConfig['validators']) {
    field.validators = field.validators || {};
    field.validators[name] = validator;
  }

  private isEnum(schema: JSONSchema7): boolean {
    return (
      !!schema.enum ||
      (schema.anyOf && (schema.anyOf as JSONSchema7[]).every(isConst)) ||
      (schema.oneOf && (schema.oneOf as JSONSchema7[]).every(isConst)) ||
      (schema.uniqueItems && schema.items && !Array.isArray(schema.items) && this.isEnum(<JSONSchema7>schema.items))
    );
  }

  private toEnumOptions(schema: JSONSchema7): { value: any; label: any }[] {
    if (schema.enum) {
      return schema.enum.map((value) => ({ value, label: value }));
    }

    const toEnum = (s: JSONSchema7) => {
      const value = s.hasOwnProperty('const') ? s.const : s.enum[0];
      const option: any = { value, label: s.title || value };
      if (s.readOnly) {
        option.disabled = true;
      }

      return option;
    };

    if (schema.anyOf) {
      return (schema.anyOf as JSONSchema7[]).map(toEnum);
    }

    if (schema.oneOf) {
      return (schema.oneOf as JSONSchema7[]).map(toEnum);
    }

    return this.toEnumOptions(<JSONSchema7>schema.items);
  }

  private isFieldValid(
    root: FormlyFieldConfig & { _schemasFields?: { [key: number]: FormlyFieldConfig } },
    i: number,
    schemas: JSONSchema7[],
    options: IOptions,
  ): boolean {
    if (!root._schemasFields) {
      Object.defineProperty(root, '_schemasFields', { enumerable: false, writable: true, configurable: true });
      root._schemasFields = {};
    }

    let field = root._schemasFields[i];
    const model = root.model ? clone(root.model) : root.fieldArray ? [] : {};
    if (!field) {
      field = root._schemasFields[i] = root.options.build({
        form: Array.isArray(model) ? new FormArray([]) : new FormGroup({}),
        fieldGroup: [
          this._toFieldConfig(schemas[i], {
            ...options,
            resetOnHide: true,
            ignoreDefault: true,
            map: null,
            strict: true,
          }),
        ],
        model,
        options: {},
      });
    } else {
      (field as any).model = model;
      root.options.build(field);
    }

    return field.form.valid;
  }

  private mergeFields(f1: any, f2: any) {
    for (let prop in f2) {
      const f1Prop = prop === 'templateOptions' ? 'props' : prop;
      if (isObject(f1[f1Prop]) && isObject(f2[prop])) {
        f1[f1Prop] = this.mergeFields(f1[f1Prop], f2[prop]);
      } else if (f2[prop] != null) {
        f1[f1Prop] = f2[prop];
      }
    }

    return f1;
  }
}
