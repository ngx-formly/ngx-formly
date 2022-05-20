import { FormlyJsonschema } from './formly-json-schema.service';
import { JSONSchema7 } from 'json-schema';
import { FormlyFieldConfig, FormlyFieldProps, FieldArrayType } from '@ngx-formly/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { createComponent, FormlyInputModule } from '@ngx-formly/core/testing';
import { Component } from '@angular/core';

const renderComponent = ({ schema, model }: { schema: JSONSchema7; model?: any }) => {
  const field = new FormlyJsonschema().toFieldConfig(schema);

  const options = createComponent<{ field: FormlyFieldConfig }>({
    template: `
      <form [formGroup]="form">
        <formly-form
          [model]="model"
          [fields]="fields"
          [options]="options"
          [form]="form">
        </formly-form>
      </form>
    `,
    inputs: {
      fields: [field],
      model: model || {},
      form: Array.isArray(model) ? new FormArray([]) : new FormGroup({}),
    } as any,
    imports: [FormlyInputModule],
    declarations: [ArrayTypeComponent],
    config: {
      types: [
        { name: 'object', extends: 'formly-group' },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'multischema', extends: 'formly-group' },
        { name: 'enum', extends: 'input' },
        { name: 'string', extends: 'input' },
        { name: 'number', extends: 'input', defaultOptions: { type: 'number' } },
        { name: 'integer', extends: 'input', defaultOptions: { type: 'number' } },
      ],
    },
  });

  return { ...options, field };
};

describe('Service: FormlyJsonschema', () => {
  let formlyJsonschema: FormlyJsonschema;
  const emmptyFieldProps: FormlyFieldProps = {
    label: undefined,
    readonly: undefined,
    description: undefined,
  };
  beforeEach(() => {
    formlyJsonschema = new FormlyJsonschema();
  });

  describe('keyword support', () => {
    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1
    describe('type keywords', () => {
      it('should guess type as object when properties is set', () => {
        const schema: JSONSchema7 = {
          properties: {
            string: { type: 'string' },
          },
        };
        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.type).toBe('object');
      });

      it('should guess a single array value', () => {
        const schema: JSONSchema7 = { type: ['string'] };
        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.type).toBe('string');
      });

      it('should support nullable field type', () => {
        const schema: JSONSchema7 = { type: ['null', 'string'] };
        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.type).toBe('string');
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#numeric
    describe('number validation keywords', () => {
      it('should support minimum, maximum and multipleOf', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          minimum: 5,
          maximum: 10,
        };
        const { props } = formlyJsonschema.toFieldConfig(numSchema);
        expect(props.min).toBe(numSchema.minimum);
        expect(props.max).toBe(numSchema.maximum);
      });

      it('should support exclusiveMinimum', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          exclusiveMinimum: 5,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);

        const exclusiveMinimum = config.validators.exclusiveMinimum;
        expect(exclusiveMinimum).toBeDefined();
        expect(exclusiveMinimum(new FormControl(4))).toBeFalse();
        expect(exclusiveMinimum(new FormControl(5))).toBeFalse();
        expect(exclusiveMinimum(new FormControl(6))).toBeTrue();
      });

      it('should support exclusiveMaximum', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          exclusiveMaximum: 10,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);

        const exclusiveMaximum = config.validators.exclusiveMaximum;
        expect(exclusiveMaximum).toBeDefined();
        expect(exclusiveMaximum(new FormControl(10))).toBeFalse();
        expect(exclusiveMaximum(new FormControl(11))).toBeFalse();
        expect(exclusiveMaximum(new FormControl(6))).toBeTrue();
      });

      it('should support multipleOf', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          multipleOf: 5,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.props.step).toBe(numSchema.multipleOf);

        const multipleOfValidator = config.validators.multipleOf;
        expect(multipleOfValidator).toBeDefined();
        expect(multipleOfValidator(new FormControl(9))).toBeFalse();
        expect(multipleOfValidator(new FormControl(10))).toBeTrue();
      });

      it('should support passing float multipleOf', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          multipleOf: 0.15,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.props.step).toBe(numSchema.multipleOf);

        const multipleOfValidator = config.validators.multipleOf;
        expect(multipleOfValidator).toBeDefined();
        expect(multipleOfValidator(new FormControl(0))).toBeTrue();
        expect(multipleOfValidator(new FormControl(1))).toBeFalse();
        expect(multipleOfValidator(new FormControl(10))).toBeFalse();
        expect(multipleOfValidator(new FormControl(15))).toBeTrue();
        // rounding issues (15.30/0.15 = 102.00000000000001)
        expect(multipleOfValidator(new FormControl(15.3))).toBeTrue();
        expect(multipleOfValidator(new FormControl(150))).toBeTrue();
      });

      it('should be a number value', () => {
        const f = formlyJsonschema.toFieldConfig({ type: 'number' });
        expect(validateType(f, 5)).toBeTrue();
        expect(validateType(f, 1.5)).toBeTrue();
        expect(validateType(f, undefined)).toBeTrue();
        expect(validateType(f, '1')).toBeFalse();
        expect(validateType(f, null)).toBeFalse();
      });

      it('should be an integer value', () => {
        const f = formlyJsonschema.toFieldConfig({ type: 'integer' });
        expect(validateType(f, 5)).toBeTrue();
        expect(validateType(f, undefined)).toBeTrue();
        expect(validateType(f, 1.5)).toBeFalse();
        expect(validateType(f, '1')).toBeFalse();
        expect(validateType(f, null)).toBeFalse();
      });
    });

    describe('null type', () => {
      it('should be a null value', () => {
        const f = formlyJsonschema.toFieldConfig({ type: 'null' });
        expect(validateType(f, null)).toBeTrue();
        expect(validateType(f, undefined)).toBeTrue();
        expect(validateType(f, '1')).toBeFalse();
        expect(validateType(f, 5)).toBeFalse();
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#string
    describe('string validation keywords', () => {
      it('should support pattern', () => {
        const schema: JSONSchema7 = {
          type: 'string',
          pattern: 'Hello World!',
        };
        const { props } = formlyJsonschema.toFieldConfig(schema);
        expect(props.pattern).toBe(schema.pattern);
      });

      it('should support minLength and maxLength', () => {
        const schema: JSONSchema7 = {
          type: 'string',
          minLength: 5,
          maxLength: 10,
        };
        const { props } = formlyJsonschema.toFieldConfig(schema);
        expect(props.minLength).toBe(schema.minLength);
        expect(props.maxLength).toBe(schema.maxLength);
      });

      it('should set nullable string type to `null` if empty', () => {
        const schema: JSONSchema7 = {
          type: ['string', 'null'],
        };

        const {
          parsers: [nullIfEmpty],
        } = formlyJsonschema.toFieldConfig(schema);
        expect(nullIfEmpty('')).toBeNull();
        expect(nullIfEmpty('test')).toEqual('test');
      });

      it('should be a string value', () => {
        const f = formlyJsonschema.toFieldConfig({ type: 'string' });
        expect(validateType(f, '1')).toBeTrue();
        expect(validateType(f, undefined)).toBeTrue();
        expect(validateType(f, null)).toBeFalse();
        expect(validateType(f, 5)).toBeFalse();
      });

      it('should be a string or null value', () => {
        const f = formlyJsonschema.toFieldConfig({ type: ['string', 'null'] });
        expect(validateType(f, '1')).toBeTrue();
        expect(validateType(f, undefined)).toBeTrue();
        expect(validateType(f, null)).toBeTrue();
        expect(validateType(f, 5)).toBeFalse();
      });
    });

    // TODO: Add support for contains
    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4
    describe('array validation keywords', () => {
      it('should be an array value', () => {
        const f = formlyJsonschema.toFieldConfig({ type: 'array' });
        expect(validateType(f, ['sss'])).toBeTrue();
        expect(validateType(f, undefined)).toBeTrue();
        expect(validateType(f, null)).toBeFalse();
        expect(validateType(f, 5)).toBeFalse();
        expect(validateType(f, {})).toBeFalse();
      });

      it('supports array items keyword as object', () => {
        const schema: JSONSchema7 = {
          type: 'array',
          items: { type: 'string' },
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        const baseConfig: FormlyFieldConfig = {
          type: 'array',
          defaultValue: undefined,
          props: { ...emmptyFieldProps },
          templateOptions: { ...emmptyFieldProps },
          fieldArray: expect.any(Function),
          validators: expectTypeValidator(['array']),
        };

        expect(config).toEqual(baseConfig);
      });

      it('supports array items as array of schemas', () => {
        const schema: JSONSchema7 = {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
        };

        const config = formlyJsonschema.toFieldConfig(schema);

        const childConfig: FormlyFieldConfig = {
          props: { ...emmptyFieldProps, required: true, removable: false },
          templateOptions: { ...emmptyFieldProps, required: true, removable: false },
          type: 'string',
          defaultValue: undefined,
          parsers: [expect.any(Function)],
          validators: expectTypeValidator(['string']),
        };
        const childConfig2: FormlyFieldConfig = {
          props: { ...emmptyFieldProps, required: true, removable: false },
          templateOptions: { ...emmptyFieldProps, required: true, removable: false },
          type: 'number',
          defaultValue: undefined,
          parsers: [expect.any(Function)],
          validators: expectTypeValidator(['number']),
        };

        expect(config.type).toEqual('array');
        expect(getFieldArrayChild(config)).toEqual(childConfig);
        expect(config.fieldGroup).toBeUndefined();
        // TODO: is this the best way to test this?
        // artificially increase the length of the fieldGroup
        // since the getter that is defined is based on that.
        config.fieldGroup = [null];
        expect(getFieldArrayChild(config)).toEqual(childConfig2);
        config.fieldGroup.push(null);
        expect(getFieldArrayChild(config)).toEqual({});
      });

      it('supports array additionalitems when array items are defined as an array of schemas', () => {
        const schema: JSONSchema7 = {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
          additionalItems: { type: 'boolean' },
        };

        const config = formlyJsonschema.toFieldConfig(schema);

        const childConfig: FormlyFieldConfig = {
          props: { ...emmptyFieldProps, required: true, removable: false },
          templateOptions: { ...emmptyFieldProps, required: true, removable: false },
          type: 'string',
          defaultValue: undefined,
          parsers: [expect.any(Function)],
          validators: expectTypeValidator(['string']),
        };
        const childConfig2: FormlyFieldConfig = {
          props: { ...emmptyFieldProps, required: true, removable: false },
          templateOptions: { ...emmptyFieldProps, required: true, removable: false },
          type: 'number',
          defaultValue: undefined,
          parsers: [expect.any(Function)],
          validators: expectTypeValidator(['number']),
        };
        const childConfig3: FormlyFieldConfig = {
          props: { ...emmptyFieldProps, required: true },
          templateOptions: { ...emmptyFieldProps, required: true },
          type: 'boolean',
          defaultValue: undefined,
          validators: expectTypeValidator(['boolean']),
        };

        expect(getFieldArrayChild(config)).toEqual(childConfig);
        // TODO: is this the best way to test this?
        // artificially increase the length of the fieldGroup
        // since the getter that is defined is based on that.
        config.fieldGroup = [null];
        expect(getFieldArrayChild(config)).toEqual(childConfig2);
        config.fieldGroup.push(null);
        // should return the additional items schema when the fieldGroup's length
        // is greater than the number of items array config validatoins
        expect(getFieldArrayChild(config)).toEqual(childConfig3);
        expect(config.type).toEqual('array');
      });

      it('supports array without items keyword', () => {
        const schema: JSONSchema7 = {
          type: 'array',
        };
        const config = formlyJsonschema.toFieldConfig(schema);
        const childConfig: FormlyFieldConfig = {};

        expect(getFieldArrayChild(config)).toEqual(childConfig);
        expect(config.type).toEqual('array');
      });

      it('should support minItems', () => {
        const numSchema: JSONSchema7 = {
          type: 'array',
          minItems: 2,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.props.minItems).toBe(numSchema.minItems);

        const minItemsValidator = config.validators.minItems;
        expect(minItemsValidator).toBeDefined();
        expect(minItemsValidator(new FormControl([1]))).toBeFalse();
        expect(minItemsValidator(new FormControl([]))).toBeFalse();
        expect(minItemsValidator(new FormControl([1, 2]))).toBeTrue();
        expect(minItemsValidator(new FormControl([1, 2, 3]))).toBeTrue();
      });

      it('minItems: should set default value', () => {
        const numSchema: JSONSchema7 = {
          type: 'array',
          minItems: 2,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.defaultValue).toEqual([undefined, undefined]);
      });

      it('should support maxItems', () => {
        const numSchema: JSONSchema7 = {
          type: 'array',
          maxItems: 2,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.props.maxItems).toBe(numSchema.maxItems);

        const maxItemsValidator = config.validators.maxItems;
        expect(maxItemsValidator).toBeDefined();
        expect(maxItemsValidator(new FormControl([1, 2, 3]))).toBeFalse();
        expect(maxItemsValidator(new FormControl([1, 2]))).toBeTrue();
        expect(maxItemsValidator(new FormControl([]))).toBeTrue();
      });

      it('should support uniqueItems', () => {
        const numSchema: JSONSchema7 = {
          type: 'array',
          uniqueItems: true,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.props.uniqueItems).toBeTrue();

        const uniqueItemsValidator = config.validators.uniqueItems;
        expect(uniqueItemsValidator).toBeDefined();
        expect(uniqueItemsValidator(new FormControl(null))).toBeTrue();
        expect(uniqueItemsValidator(new FormControl([1, 2, 3]))).toBeTrue();
        expect(uniqueItemsValidator(new FormControl([1, 2, 2]))).toBeFalse();

        expect(uniqueItemsValidator(new FormControl([{ a: 2 }, { a: 1 }]))).toBeTrue();
        expect(uniqueItemsValidator(new FormControl([{ a: 1 }, { a: 1 }]))).toBeFalse();
      });
    });

    // TODO: complete support for Object validation keywords
    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5
    describe('object validation keywords', () => {
      it('should be an object value', () => {
        const f = formlyJsonschema.toFieldConfig({ type: 'object' });
        expect(validateType(f, {})).toBeTrue();
        expect(validateType(f, undefined)).toBeTrue();
        expect(validateType(f, null)).toBeFalse();
        expect(validateType(f, 5)).toBeFalse();
        expect(validateType(f, ['sss'])).toBeFalse();
      });

      describe('required keyword', () => {
        it('root object with required property', () => {
          const { field } = renderComponent({
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
              },
            },
          });

          const childField = field.fieldGroup[0];
          expect(childField.props.required).toBeTrue();
        });

        it('nested required object with required property', () => {
          const { field } = renderComponent({
            schema: {
              type: 'object',
              required: ['address'],
              properties: {
                address: {
                  type: 'object',
                  required: ['city'],
                  properties: {
                    city: { type: 'string' },
                  },
                },
              },
            },
          });

          const childField = field.fieldGroup[0].fieldGroup[0];
          expect(childField.props.required).toBeTrue();
        });

        it('nested optional object with required property', () => {
          const { field, fixture } = renderComponent({
            schema: {
              type: 'object',
              properties: {
                address: {
                  type: 'object',
                  required: ['city'],
                  properties: {
                    city: { type: 'string' },
                  },
                },
              },
            },
          });

          const childField = field.fieldGroup[0].fieldGroup[0];
          expect(childField.props.required).toBeFalse();

          childField.formControl.setValue('***');
          fixture.detectChanges();
          expect(childField.props.required).toBeTrue();
        });

        it('required with oneOf/anyOf', () => {
          const { field } = renderComponent({
            schema: {
              type: 'object',
              required: ['address'],
              properties: {
                address: {
                  type: 'object',
                  oneOf: [
                    {
                      required: ['city'],
                      properties: {
                        city: { type: 'string', title: 'foo' },
                      },
                    },
                  ],
                },
              },
            },
          });

          const cityField = field.form.get('address.city');
          expect(cityField.valid).toBeFalsy();
        });

        it('should not kill other expressions', () => {
          const { field } = renderComponent(
            JSON.parse(`{
            "schema": {
              "type": "object",
              "required": [
                "name"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "widget": {
                    "formlyConfig": {
                      "expressions": {
                        "props.readonly": "model.readonly"
                      }
                    }
                  }
                }
              }
            }
          }`),
          );

          const childField = field.fieldGroup[0];
          expect(childField.expressions['props.readonly']).toEqual('model.readonly');
        });
      });

      describe('dependencies', () => {
        describe('with property dependencies', () => {
          it('should add required properties', () => {
            const { field, fixture } = renderComponent({
              model: { credit_card: 121223233 },
              schema: {
                type: 'object',
                properties: {
                  credit_card: { type: 'string' },
                  billing_address: { type: 'string' },
                },
                dependencies: {
                  credit_card: ['billing_address'],
                },
              },
            });

            const [creditCardField, billingAddressField] = field.fieldGroup;
            expect(billingAddressField.props.required).toBeTrue();

            creditCardField.formControl.setValue(null);
            fixture.detectChanges();
            expect(billingAddressField.props.required).toBeFalse();
          });
        });

        describe('with schema dependencies', () => {
          it('should display extended schema', () => {
            const schema: JSONSchema7 = {
              type: 'object',
              properties: {
                credit_card: { type: 'number' },
              },
              dependencies: {
                credit_card: {
                  properties: {
                    billing_address: { type: 'string' },
                  },
                  required: ['billing_address'],
                },
              },
            };

            const config = formlyJsonschema.toFieldConfig(schema).fieldGroup;
            const hideExpr = config[1].expressions.hide as any;
            expect(hideExpr({ credit_card: null })).toBeTrue();
            expect(hideExpr({ credit_card: 121223233 })).toBeFalse();
          });
          it('should display extended schema with oneOf', () => {
            const schema: JSONSchema7 = {
              type: 'object',
              properties: {
                state: { type: 'boolean' },
              },
              dependencies: {
                state: {
                  type: 'object',
                  oneOf: [
                    {
                      properties: {
                        state: { enum: [true] },
                        option1: { type: 'string' },
                      },
                    },
                    {
                      properties: {
                        state: { const: false },
                        option2: { type: 'string' },
                      },
                    },
                  ],
                },
              },
            };

            const [, opt1Field, opt2Field] = formlyJsonschema.toFieldConfig(schema).fieldGroup;
            const opt1HideExpr = opt1Field.expressions.hide as any;
            expect(opt1HideExpr({ state: true })).toBeFalse();
            expect(opt1HideExpr({ state: false })).toBeTrue();

            const opt2HideExpr = opt2Field.expressions.hide as any;
            expect(opt2HideExpr({ state: true })).toBeTrue();
            expect(opt2HideExpr({ state: false })).toBeFalse();
          });
        });
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#general
    describe('any instance type validation keywords', () => {
      it('should support type', () => {
        const schema: JSONSchema7 = {
          type: 'string',
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.type).toBe(schema.type);
      });

      describe('should support enum type', () => {
        it('should support enum as strig array values', () => {
          const schemaStringEnum: JSONSchema7 = {
            type: 'string',
            enum: ['The', 'Best', 'Forms'],
          };

          const schemaNumberEnum: JSONSchema7 = {
            type: 'number',
            enum: [1, 1.233333, 42, 1234163],
          };

          const schemaIntegerEnum: JSONSchema7 = {
            type: 'integer',
            enum: [1, 2, 3, 4, 5],
          };

          const enumOptions = (schemaEnum) => schemaEnum.map((value) => ({ value, label: value }));

          // labelProp and valueProp should be a function that returns what it is given
          const config = formlyJsonschema.toFieldConfig(schemaStringEnum);
          expect(config.type).toBe('enum');
          expect(config.props.options).toEqual(enumOptions(schemaStringEnum.enum));

          const config2 = formlyJsonschema.toFieldConfig(schemaNumberEnum);
          expect(config2.parsers).toEqual([expect.any(Function)]);
          expect(config2.type).toBe('enum');
          expect(config2.props.options).toEqual(enumOptions(schemaNumberEnum.enum));

          const config3 = formlyJsonschema.toFieldConfig(schemaIntegerEnum);
          expect(config3.parsers).toEqual([expect.any(Function)]);
          expect(config3.type).toBe('enum');
          expect(config3.props.options).toEqual(enumOptions(schemaIntegerEnum.enum));
        });

        // https://github.com/json-schema-org/json-schema-spec/issues/57#issuecomment-247861695
        describe('enum as oneOf/anyOf structure', () => {
          it('should support enum as oneOf/const structure', () => {
            const schema: JSONSchema7 = {
              type: 'number',
              oneOf: [
                { title: '1', const: 1 },
                { title: '2', const: 2, readOnly: true },
              ],
            };

            const {
              type,
              props: { options },
            } = formlyJsonschema.toFieldConfig(schema);

            expect(type).toEqual('enum');

            expect(options).toEqual([
              { label: '1', value: 1 },
              { label: '2', value: 2, disabled: true },
            ]);
          });

          it('should support enum as oneOf/enum structure', () => {
            const schema: JSONSchema7 = {
              type: 'number',
              oneOf: [
                { title: '1', enum: [1] },
                { title: '2', enum: [2] },
              ],
            };

            const {
              type,
              props: { options },
            } = formlyJsonschema.toFieldConfig(schema);

            expect(type).toEqual('enum');
            expect(options).toEqual([
              { label: '1', value: 1 },
              { label: '2', value: 2 },
            ]);
          });

          it('should support enum as anyOf structure', () => {
            const schema: JSONSchema7 = {
              type: 'number',
              anyOf: [
                { title: '1', enum: [1] },
                { title: '2', enum: [2] },
              ],
            };

            const {
              type,
              props: { options },
            } = formlyJsonschema.toFieldConfig(schema);

            expect(type).toEqual('enum');
            expect(options).toEqual([
              { label: '1', value: 1 },
              { label: '2', value: 2 },
            ]);
          });
        });

        describe('enum as uniqueItems & array structure', () => {
          it('with simple enum item schema definition', () => {
            const numSchema: JSONSchema7 = {
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['The', 'Best', 'Forms'],
              },
            };
            const { type, validators, props } = formlyJsonschema.toFieldConfig(numSchema);

            expect(type).toEqual('enum');
            expect(props.multiple).toBeTrue();
            expect(validators.uniqueItems).toBeDefined();
          });

          it('with nested item schema definition', () => {
            const numSchema: JSONSchema7 = {
              definitions: {
                foo: {
                  type: 'string',
                  oneOf: [
                    { title: '1', const: 1 },
                    { title: '2', const: 2 },
                  ],
                },
              },
              type: 'array',
              uniqueItems: true,
              items: { $ref: '#/definitions/foo' },
            };

            const { type, props } = formlyJsonschema.toFieldConfig(numSchema);
            expect(type).toEqual('enum');
            expect(props.multiple).toBeTrue();
          });
        });
      });

      it('should support const as hidden', () => {
        const schema: JSONSchema7 = { const: 'const' };
        const { type, defaultValue, validators } = formlyJsonschema.toFieldConfig(schema);
        expect(type).toBeUndefined();
        expect(defaultValue).toEqual('const');
        expect(validators).toBeDefined();
      });

      it('should support const as type', () => {
        const schema: JSONSchema7 = {
          type: 'string',
          const: 'const',
        };
        const {
          type,
          defaultValue,
          validators: { const: constValidator },
        } = formlyJsonschema.toFieldConfig(schema);

        expect(type).toEqual('string');
        expect(defaultValue).toBeUndefined();

        expect(constValidator).toBeDefined();
        expect(constValidator(new FormControl(null))).toBeFalse();
        expect(constValidator(new FormControl(4))).toBeFalse();
        expect(constValidator(new FormControl('const'))).toBeTrue();
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.9
    describe('Schema Re-Use With "definitions"', () => {
      it('should resolve a schema definition', () => {
        const schema: JSONSchema7 = {
          definitions: {
            address: { type: 'string' },
          },
          type: 'object',
          properties: {
            billing_address: { $ref: '#/definitions/address' },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.fieldGroup[0]).toEqual({
          key: 'billing_address',
          type: 'string',
          defaultValue: undefined,
          props: emmptyFieldProps,
          templateOptions: emmptyFieldProps,
          parsers: [expect.any(Function)],
          validators: expectTypeValidator(['string']),
        });
      });

      it('should use the locally defined annotations', () => {
        const schema: JSONSchema7 = {
          definitions: {
            address: {
              type: 'string',
              title: 'Address',
              description: 'default address',
              default: 'Foo',
            },
          },
          type: 'object',
          properties: {
            billing_address: {
              $ref: '#/definitions/address',
              title: 'Billing address',
              description: 'default billing address',
              default: 'bar',
            },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        const addressField = config.fieldGroup[0];
        expect(addressField.props.label).toEqual('Billing address');
        expect(addressField.props.description).toEqual('default billing address');
        expect(addressField.defaultValue).toEqual('bar');
      });

      it('should use the locally widget keyword', () => {
        const schema: JSONSchema7 = {
          definitions: {
            address: {
              type: 'string',
              title: 'Address',
            },
          },
          type: 'object',
          properties: {
            billing_address: {
              $ref: '#/definitions/address',
              widget: {
                formlyConfig: {
                  props: {
                    label: 'Billing address',
                  },
                },
              },
            },
          },
        } as any;

        const config = formlyJsonschema.toFieldConfig(schema);
        const addressField = config.fieldGroup[0];
        expect(addressField.props.label).toEqual('Billing address');
      });

      it('should resolve a nested schema definition', () => {
        const schema: JSONSchema7 = {
          definitions: {
            address1: { $ref: '#/definitions/address2', title: 'address1' },
            address2: { type: 'string', title: 'address2' },
          },
          type: 'object',
          properties: {
            address: { $ref: '#/definitions/address1' },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.fieldGroup[0]).toEqual({
          key: 'address',
          type: 'string',
          defaultValue: undefined,
          parsers: [expect.any(Function)],
          validators: expectTypeValidator(['string']),
          props: {
            ...emmptyFieldProps,
            label: 'address1',
          },
          templateOptions: {
            ...emmptyFieldProps,
            label: 'address1',
          },
        });
      });

      it('should resolve a recusive schema definition', () => {
        const schema: JSONSchema7 = {
          definitions: {
            person: {
              type: 'array',
              items: { $ref: '#/definitions/person' },
            },
          },

          type: 'object',

          properties: {
            person: { $ref: '#/definitions/person' },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema).fieldGroup[0];

        const expectedConfig: FormlyFieldConfig = {
          type: 'array',
          defaultValue: undefined,
          props: { ...emmptyFieldProps, required: true },
          templateOptions: { ...emmptyFieldProps, required: true },
          fieldArray: expect.any(Function),
          validators: expectTypeValidator(['array']),
        };

        const childLevel1 = getFieldArrayChild(config);
        expect(childLevel1).toEqual(expectedConfig);

        const childLevel2 = getFieldArrayChild(childLevel1);
        expect(childLevel2).toEqual(expectedConfig);

        const childLevel3 = getFieldArrayChild(childLevel2);
        expect(childLevel3).toEqual(expectedConfig);
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7
    describe('Schema allOf support', () => {
      it('should merge allOf array into single object', () => {
        const { field } = renderComponent({
          schema: {
            definitions: {
              address: {
                type: 'object',
                properties: {
                  street_address: { type: 'string' },
                  city: { type: 'string' },
                  state: { type: 'string' },
                },
                required: ['street_address', 'city', 'state'],
              },
            },
            type: 'object',
            required: ['billing_address'],
            properties: {
              billing_address: {
                allOf: [
                  { $ref: '#/definitions/address' },
                  {
                    properties: {
                      type: { enum: ['residential', 'business'] },
                    },
                  },
                ],
              },
            },
          },
        });
        const expected = field.fieldGroup[0].fieldGroup.map(({ key, type, props: { required } }) => ({
          key,
          type,
          required,
        }));
        expect(expected).toEqual([
          { key: 'street_address', type: 'string', required: true },
          { key: 'city', type: 'string', required: true },
          { key: 'state', type: 'string', required: true },
          { key: 'type', type: 'enum', required: undefined },
        ]);
      });

      it('should handle nested allOf', () => {
        const { field } = renderComponent({
          schema: {
            definitions: {
              baseAddress: {
                type: 'object',
                properties: {
                  street_address: { type: 'string' },
                  city: { type: 'string' },
                  state: { type: 'string' },
                },
                required: ['street_address', 'city', 'state'],
              },
              mailingAddress: {
                allOf: [
                  { $ref: '#/definitions/baseAddress' },
                  {
                    properties: {
                      country: { type: 'string' },
                    },
                  },
                ],
              },
            },
            type: 'object',
            required: ['billing_address'],
            properties: {
              billing_address: {
                allOf: [
                  { $ref: '#/definitions/mailingAddress' },
                  {
                    properties: {
                      type: { enum: ['residential', 'business'] },
                    },
                  },
                ],
              },
            },
          },
        });
        const expected = field.fieldGroup[0].fieldGroup.map(({ key, type, props: { required } }) => ({
          key,
          type,
          required,
        }));
        expect(expected).toEqual([
          { key: 'street_address', type: 'string', required: true },
          { key: 'city', type: 'string', required: true },
          { key: 'state', type: 'string', required: true },
          { key: 'country', type: 'string', required: undefined },
          { key: 'type', type: 'enum', required: undefined },
        ]);
      });

      it('should merge required fields', () => {
        const schema: JSONSchema7 = {
          allOf: [
            {
              properties: { firstname: { type: 'string' } },
              required: ['firstname'],
            },
            {
              properties: { lastname: { type: 'string' } },
              required: ['lastname'],
            },
          ],
        };
        const { fieldGroup } = formlyJsonschema.toFieldConfig(schema);
        const expected = fieldGroup.map(({ key, expressions }) => ({
          key,
          required: !!expressions['props.required'],
        }));
        expect(expected).toEqual([
          { key: 'firstname', required: true },
          { key: 'lastname', required: true },
        ]);
      });

      it('should merge allOf with base schema', () => {
        const { field } = renderComponent({
          schema: {
            properties: { firstname: { type: 'string' } },
            required: ['firstname'],
            allOf: [
              {
                properties: { familyname: { type: 'string' } },
                required: ['familyname'],
              },
              {
                properties: { lastname: { type: 'string' } },
                required: ['lastname'],
              },
            ],
          },
        });
        const expected = field.fieldGroup.map(({ key, props: { required } }) => ({ key, required }));
        expect(expected).toEqual([
          { key: 'firstname', required: true },
          { key: 'familyname', required: true },
          { key: 'lastname', required: true },
        ]);
      });

      describe('merges conflict', () => {
        it('uniqueItems', () => {
          const schema: JSONSchema7 = {
            type: 'array',
            allOf: [{ uniqueItems: false }, { uniqueItems: true }],
          };
          const { props } = formlyJsonschema.toFieldConfig(schema);
          expect(props.uniqueItems).toBeTrue();
        });

        it('minLength', () => {
          const schema: JSONSchema7 = {
            type: 'string',
            allOf: [{ minLength: 10 }, { minLength: 100 }],
          };
          const { props } = formlyJsonschema.toFieldConfig(schema);
          expect(props.minLength).toEqual(100);
        });

        it('maxLength', () => {
          const schema: JSONSchema7 = {
            type: 'string',
            allOf: [{ maxLength: 10 }, { maxLength: 100 }],
          };
          const { props } = formlyJsonschema.toFieldConfig(schema);
          expect(props.maxLength).toEqual(10);
        });
      });
    });

    describe('Multi-Schema (oneOf, anyOf) support', () => {
      let schema: JSONSchema7;

      describe('oneOf', () => {
        beforeEach(() => {
          schema = {
            type: 'object',
            oneOf: [
              {
                properties: { foo: { type: 'string' } },
                required: ['foo'],
              },
              { properties: { bar: { type: 'string' } } },
            ],
          };
        });

        it('should render multischema type when oneOf is present', () => {
          const {
            fieldGroup: [{ type: oneOfType }],
          } = formlyJsonschema.toFieldConfig(schema);
          expect(oneOfType).toEqual('multischema');
        });

        it('should render the valid oneOf field on first render', () => {
          const { field } = renderComponent({ schema });
          const [
            ,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeTrue();
          expect(barField.hide).toBeFalse();
        });

        it('should render the valid oneOf field when properties have the same name', () => {
          const { field } = renderComponent({
            model: { foo: 2 },
            schema: {
              type: 'object',
              oneOf: [
                { properties: { foo: { const: 1 } }, title: 'foo1' },
                { properties: { foo: { const: 2 } }, title: 'foo2' },
              ],
            },
          });
          const [
            ,
            {
              fieldGroup: [foo1Field, foo2Field],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(foo1Field.hide).toBeTrue();
          expect(foo2Field.hide).toBeFalse();
        });

        it('should not share the same formControl when a prop is duplicated in oneOf', () => {
          const { field } = renderComponent({
            model: { foo: 2 },
            schema: {
              type: 'object',
              oneOf: [{ properties: { foo: { const: 1 } } }, { properties: { foo: { type: 'object' } } }],
            },
          });

          const [
            ,
            {
              fieldGroup: [foo1Field, foo2Field],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(foo1Field.fieldGroup[0].formControl).not.toEqual(foo2Field.fieldGroup[0].formControl);
          expect(field.model).toEqual({ foo: 2 });
        });

        it('should render the selected oneOf field', () => {
          const { field, detectChanges } = renderComponent({
            model: { foo: 'test' },
            schema,
          });

          const [
            enumField,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeFalse();
          expect(barField.hide).toBeTrue();

          enumField.formControl.setValue(1);
          detectChanges();

          expect(field.model).toEqual({});
          expect(fooField.hide).toBeTrue();
          expect(barField.hide).toBeFalse();
        });

        it('should support oneOf within array', () => {
          const { field } = renderComponent({
            model: [{ foo: 2 }],
            schema: {
              type: 'array',
              items: {
                type: 'object',
                oneOf: [{ properties: { foo: { const: 1 } } }, { properties: { foo: { const: 2 } } }],
              },
            },
          });

          const [
            ,
            {
              fieldGroup: [foo1Field, foo2Field],
            },
          ] = field.fieldGroup[0].fieldGroup[0].fieldGroup;

          expect(foo1Field.hide).toBeTrue();
          expect(foo2Field.hide).toBeFalse();
        });

        it('should support oneOf for a non-object type', () => {
          const { field } = renderComponent({
            model: { foo: 2 },
            schema: {
              type: 'object',
              properties: {
                foo: {
                  oneOf: [{ type: 'string' }, { type: 'integer' }],
                },
              },
            },
          });

          const [
            ,
            {
              fieldGroup: [foo1Field, foo2Field],
            },
          ] = field.fieldGroup[0].fieldGroup[0].fieldGroup;
          expect(foo1Field.hide).toBeTrue();
          expect(foo2Field.hide).toBeFalse();
        });

        it('should support oneOf using mixed type', () => {
          const { field } = renderComponent({
            model: { foo: [] },
            schema: {
              type: 'object',
              oneOf: [{ properties: { foo: { type: 'object' } } }, { properties: { foo: { type: 'array' } } }],
            },
          });

          const [
            ,
            {
              fieldGroup: [foo1Field, foo2Field],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(foo1Field.hide).toBeTruthy();
          expect(foo2Field.hide).toBeFalsy();
        });

        it('should support oneOf for a non-object type', () => {
          const { field } = renderComponent({
            model: { foo: 2 },
            schema: {
              type: 'object',
              properties: {
                foo: {
                  oneOf: [{ type: 'string' }, { type: 'integer' }],
                },
              },
            },
          });

          const [
            ,
            {
              fieldGroup: [foo1Field, foo2Field],
            },
          ] = field.fieldGroup[0].fieldGroup[0].fieldGroup;
          expect(foo1Field.hide).toBeTruthy();
          expect(foo2Field.hide).toBeFalsy();
        });

        it('should support nested oneOf', () => {
          const { field } = renderComponent({
            model: { foo: 2 },
            schema: {
              type: 'object',
              oneOf: [
                {
                  type: 'object',
                  oneOf: [{ properties: { foo: { const: 1 } } }, { properties: { foo: { const: 2 } } }],
                },
                { properties: { foo: { const: 3 } } },
              ],
            },
          });

          const [
            ,
            {
              fieldGroup: [foo1Field, foo2Field],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(foo1Field.hide).toBeFalse();
          expect(foo2Field.hide).toBeTrue();
          expect(field.model).toEqual({ foo: 2 });
        });

        it('should not take account of default value for the selected oneOf', () => {
          const { field } = renderComponent({
            schema: {
              type: 'object',
              oneOf: [
                { properties: { foo: { type: 'string' } }, required: ['foo'] },
                { properties: { bar: { type: 'string', default: 'bar' } }, required: ['bar'] },
              ],
            },
          });

          const [
            ,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeFalse();
          expect(barField.hide).toBeTrue();
        });

        it('should take account of default value', () => {
          const { field, detectChanges } = renderComponent({
            schema: {
              type: 'object',
              oneOf: [
                { properties: { foo: { type: 'string', default: 'foo' } } },
                { properties: { bar: { type: 'string', default: 'bar' } } },
              ],
            },
          });
          const [
            enumField,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeFalse();
          expect(barField.hide).toBeTrue();
          expect(field.model).toEqual({ foo: 'foo' });

          enumField.formControl.setValue(1);
          detectChanges();

          expect(fooField.hide).toBeTrue();
          expect(barField.hide).toBeFalse();
          expect(field.model).toEqual({ bar: 'bar' });
        });

        it('should set default value on change', () => {
          const { field, detectChanges } = renderComponent({
            model: { bar: 'test' },
            schema: {
              type: 'object',
              oneOf: [
                { properties: { foo: { type: 'string', default: 'foo' } } },
                { properties: { bar: { type: 'string', default: 'bar' } } },
              ],
            },
          });
          const [
            enumField,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeTrue();
          expect(barField.hide).toBeFalse();
          expect(field.model).toEqual({ bar: 'test' });

          enumField.formControl.setValue(0);
          detectChanges();
          expect(field.model).toEqual({ foo: 'foo' });

          enumField.formControl.setValue(1);
          detectChanges();
          expect(field.model).toEqual({ bar: 'bar' });
        });

        it('should render the selected oneOf field (with more matched fields)', () => {
          const { field } = renderComponent({
            model: { foo1: 'test', bar: 'test' },
            schema: {
              type: 'object',
              oneOf: [
                { properties: { foo1: { type: 'string' } } },
                {
                  properties: {
                    foo1: { type: 'string' },
                    bar: { type: 'string' },
                  },
                },
              ],
            },
          });
          const [
            ,
            {
              fieldGroup: [f1, f2],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(f1.hide).toBeTrue();
          expect(f2.hide).toBeFalse();
        });

        it('should render the selected oneOf field (empty array object)', () => {
          const { field } = renderComponent({
            model: { bar: [] },
            schema: {
              type: 'object',
              oneOf: [
                { properties: { foo1: { type: 'string' } } },
                {
                  properties: {
                    bar: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              ],
            },
          });
          const [
            ,
            {
              fieldGroup: [f1, f2],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(f1.hide).toBeTruthy();
          expect(f2.hide).toBeFalsy();
        });

        it('should not select oneOf readOnly option', () => {
          const { field } = renderComponent({
            schema: {
              type: 'object',
              anyOf: [
                {
                  properties: { foo: { type: 'string' } },
                  readOnly: true,
                },
                { properties: { bar: { type: 'string' } } },
              ],
            },
          });

          const [
            ,
            {
              fieldGroup: [f1, f2],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(f1.props.disabled).toBeTrue();
          expect(f1.hide).toBeTrue();
          expect(f2.hide).toBeFalse();
        });

        it('should select oneOf readOnly option when model is set', () => {
          const { field } = renderComponent({
            model: { foo: 'test' },
            schema: {
              type: 'object',
              anyOf: [
                {
                  properties: { foo: { type: 'string' } },
                  readOnly: true,
                },
                { properties: { bar: { type: 'string' } } },
              ],
            },
          });

          const [
            ,
            {
              fieldGroup: [f1, f2],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(f1.props.disabled).toBeTrue();
          expect(f1.hide).toBeFalse();
          expect(f2.hide).toBeTrue();
        });

        it('should take account of model change after build', () => {
          const { field, fixture } = renderComponent({
            model: { bar: 'test' },
            schema,
          });

          const [
            ,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeTruthy();
          expect(barField.hide).toBeFalsy();

          fixture.componentInstance['model'] = { foo: 'test' };
          fixture.detectChanges();

          expect(fooField.hide).toBeFalsy();
          expect(barField.hide).toBeTruthy();
        });
      });

      describe('anyOf', () => {
        beforeEach(() => {
          schema = {
            type: 'object',
            anyOf: [
              {
                properties: { foo: { type: 'string' } },
                required: ['foo'],
              },
              { properties: { bar: { type: 'string' } } },
            ],
          };
        });

        it('should render multischema type when anyOf is present', () => {
          const {
            fieldGroup: [{ type: anyOfType }],
          } = formlyJsonschema.toFieldConfig(schema);
          expect(anyOfType).toEqual('multischema');
        });

        it('should render the valid anyOf field on first render', () => {
          const { field } = renderComponent({ schema });
          const [
            ,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeTrue();
          expect(barField.hide).toBeFalse();
        });

        it('should render the filled anyOf field on first render (matched one anyOf schema)', () => {
          const { field } = renderComponent({
            model: { bar: 'bar' },
            schema: {
              type: 'object',
              anyOf: [
                { properties: { foo: { type: 'string', default: 'foo' } } },
                { properties: { bar: { type: 'string' } } },
              ],
            },
          });

          const [
            ,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeTrue();
          expect(barField.hide).toBeFalse();
        });

        it('should render the filled anyOf field on first render (matched multi anyOf schema)', () => {
          const { field } = renderComponent({
            model: { bar: 'bar', foo: 'test' },
            schema: {
              type: 'object',
              anyOf: [
                { properties: { foo: { type: 'string', default: 'foo' } } },
                { properties: { bar: { type: 'string' } } },
              ],
            },
          });

          const [
            ,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeFalse();
          expect(barField.hide).toBeFalse();
        });

        it('should render the selected anyOf field', () => {
          const { field, detectChanges } = renderComponent({ schema, model: { foo: 'test' } });
          const [
            enumField,
            {
              fieldGroup: [fooField, barField],
            },
          ] = field.fieldGroup[0].fieldGroup;

          expect(fooField.hide).toBeFalse();
          expect(barField.hide).toBeTrue();

          enumField.formControl.setValue([1]);
          detectChanges();

          expect(field.model).toEqual({});
          expect(fooField.hide).toBeTrue();
          expect(barField.hide).toBeFalse();
        });

        it('should reset the unselected anyOf field with default value', () => {
          const { field, detectChanges } = renderComponent({
            schema: {
              type: 'object',
              anyOf: [
                { properties: { foo: { type: 'string', default: 'foo' } } },
                { properties: { bar: { type: 'string', default: 'bar' } } },
              ],
            },
          });

          expect(field.model).toEqual({ foo: 'foo' });

          const [enumField] = field.fieldGroup[0].fieldGroup;
          enumField.formControl.setValue([1]);
          detectChanges();

          expect(field.model).toEqual({ bar: 'bar' });
        });

        it('should reset the unselected anyOf field (same key)', () => {
          const { field, detectChanges } = renderComponent({
            schema: {
              type: 'object',
              anyOf: [
                { properties: { foo: { type: 'string', default: 'foo' } } },
                { properties: { foo: { type: 'string', default: 'bar' } } },
              ],
            },
          });

          expect(field.model).toEqual({ foo: 'foo' });

          const [enumField] = field.fieldGroup[0].fieldGroup;
          enumField.formControl.setValue([1]);
          detectChanges();

          expect(field.model).toEqual({ foo: 'bar' });
        });
      });
    });

    // TODO: discuss support of writeOnly. Note: this may not be needed.
    // TODO: discuss support of examples. By spec, default can be used in its place.
    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.10
    describe('schema annotations', () => {
      it('should support schema annotations', () => {
        const schema: JSONSchema7 = {
          title: 'Test title',
          description: 'Test description',
          readOnly: true,
          default: 'Super Heroic Forms Generator',
          type: 'string',
        };
        const { defaultValue, props } = formlyJsonschema.toFieldConfig(schema);
        expect(props.label).toBe(schema.title);
        expect(defaultValue).toBe(schema.default);
        expect(props.description).toBe(schema.description);
        expect(props.readonly).toBe(schema.readOnly);
        expect(props.disabled).toBe(schema.readOnly);
      });
    });
  });

  describe('widget formlyConfig options merging', () => {
    it('should merge a formlyConfig object specified in the widget property into the formly config', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "type": "integer",
        "widget": {
          "formlyConfig": {
            "props": {
              "label": "Age"
            }
          }
        }
      }`);

      const { props } = formlyJsonschema.toFieldConfig(schema);
      expect(props.label).toBe('Age');
    });

    it('should handle legacy templateOptions on merge', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "type": "integer",
        "widget": {
          "formlyConfig": {
            "templateOptions": {
              "label": "Age"
            }
          }
        }
      }`);

      const { props } = formlyJsonschema.toFieldConfig(schema);
      expect(props.label).toBe('Age');
    });

    it('should override properties that have already been set', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "type": "integer",
        "title": "Person Age",
        "widget": {
          "formlyConfig": {
            "props": {
              "label": "Age"
            }
          }
        }
      }`);

      const { props } = formlyJsonschema.toFieldConfig(schema);

      expect(props.label).toBe('Age');
    });
    it('should be possible to set the key via formlyConfig', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "title": "Custom model Key",
        "type": "object",
        "properties": {
          "withkey": {
            "type": "string",
            "title": "With Key",
            "widget": {
              "formlyConfig": {
                "key": "custom.key.path"
              }
            }
          },
          "withNumericKey": {
            "type": "string",
            "title": "With Key",
            "widget": {
              "formlyConfig": {
                "key": 0
              }
            }
          },
          "withArrayKey": {
            "type": "string",
            "title": "With Key",
            "widget": {
              "formlyConfig": {
                "key": []
              }
            }
          },
          "withoutKey": {
            "type": "string",
            "title": "Without key"
          },
          "alsoWithoutKey": {
            "type": "string",
            "title": "Also without key",
            "widget": {
              "formlyConfig": {
                "props": {
                  "type": "date"
                }
              }
            }
          }
        }
      }`);
      const fields = formlyJsonschema.toFieldConfig(schema);
      expect(fields.fieldGroup).toBeDefined();
      const fg = fields.fieldGroup;
      expect(fg.length).toEqual(5);
      expect(fg[0].key).toEqual('custom.key.path');
      expect(fg[1].key).toEqual(0);
      expect(fg[2].key).toEqual([]);
      // Check the falsy path also
      expect(fg[3].key).toEqual('withoutKey');
      expect(fg[4].key).toEqual('alsoWithoutKey');
    });
  });

  describe('FormlyJsonSchemaOptions map function', () => {
    it('should allow to pass in a "map" function to further customize the mapping', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "type": "integer",
        "title": "Person Age",
        "widget": {
          "formlyConfig": {
            "props": {
              "label": "Age"
            }
          }
        }
      }`);

      const { props } = formlyJsonschema.toFieldConfig(schema, {
        map: (field: FormlyFieldConfig) => {
          // not a very real-world mapping scenario 😊
          if (field.type === 'integer') {
            field.props.label = 'my custom label';
          }

          return field;
        },
      });

      expect(props.label).toBe('my custom label');
    });

    it('should not crash when props are not defined', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "title": "Oggetto P1",
        "type": "object",
        "properties": {
          "space1": {
            "type": "string",
            "title": "space1",
            "widget": {
                "formlyConfig": {
                    "type": "__space__",
                    "className": "flex-6-3"
                }
            }
          }
        }
      }`);

      const field = formlyJsonschema.toFieldConfig(schema, {
        map: (field: FormlyFieldConfig) => {
          if (field.type === '__space__') {
            // redefine the field
            field = {
              template: `<div class="space"></div>`,
            };
          }

          return field;
        },
      });

      expect(field).toBeDefined();
    });
  });
});

@Component({
  selector: 'formly-array-type',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index">
      <formly-group [field]="field"></formly-group>
      <button [id]="'remove-' + i" type="button" (click)="remove(i)">Remove</button>
    </div>
    <button id="add" type="button" (click)="add()">Add</button>
  `,
})
class ArrayTypeComponent extends FieldArrayType {}

function getFieldArrayChild(config: FormlyFieldConfig) {
  return (config.fieldArray as Function)(config);
}

function expectTypeValidator(schemaType: string[]) {
  return {
    type: {
      schemaType,
      expression: expect.any(Function),
    },
  };
}

function validateType({ validators }: FormlyFieldConfig, value: any) {
  return validators.type.expression(new FormControl({ value, disabled: false }));
}
