
import { FormlyJsonschema } from './formly-json-schema.service';
import { JSONSchema7 } from 'json-schema';
import { FormlyFieldConfig, FormlyTemplateOptions, FormlyFormBuilder, FormlyModule } from '@ngx-formly/core';
import { FormControl, FormGroup } from '@angular/forms';
import { inject, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MockComponent } from 'src/core/src/lib/test-utils';

describe('Service: FormlyJsonschema', () => {
  let formlyJsonschema: FormlyJsonschema;
  const emmptyTemplateOptions: FormlyTemplateOptions = {
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
        const { templateOptions: to } = formlyJsonschema.toFieldConfig(numSchema);
        expect(to.min).toBe(numSchema.minimum);
        expect(to.max).toBe(numSchema.maximum);
      });

      it('should support exclusiveMinimum', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          exclusiveMinimum: 5,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);

        const exclusiveMinimum = config.validators.exclusiveMinimum;
        expect(exclusiveMinimum).toBeDefined();
        expect(exclusiveMinimum(new FormControl(4))).toBeFalsy();
        expect(exclusiveMinimum(new FormControl(5))).toBeFalsy();
        expect(exclusiveMinimum(new FormControl(6))).toBeTruthy();
      });

      it('should support exclusiveMaximum', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          exclusiveMaximum: 10,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);

        const exclusiveMaximum = config.validators.exclusiveMaximum;
        expect(exclusiveMaximum).toBeDefined();
        expect(exclusiveMaximum(new FormControl(10))).toBeFalsy();
        expect(exclusiveMaximum(new FormControl(11))).toBeFalsy();
        expect(exclusiveMaximum(new FormControl(6))).toBeTruthy();
      });

      it('should support multipleOf', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          multipleOf: 5,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.templateOptions.step).toBe(numSchema.multipleOf);

        const multipleOfValidator = config.validators.multipleOf;
        expect(multipleOfValidator).toBeDefined();
        expect(multipleOfValidator(new FormControl(9))).toBeFalsy();
        expect(multipleOfValidator(new FormControl(10))).toBeTruthy();
      });
    });

    describe('null type', () => {
      it('should support null validation', () => {
        const schema: JSONSchema7 = {
          type: 'null',
        };
        const { type, validators } = formlyJsonschema.toFieldConfig(schema);
        expect(type).toEqual('null');
        expect(validators.null).toBeDefined();
        expect(validators.null(new FormControl(null))).toBeTruthy();
        expect(validators.null(new FormControl([1, 2, 3]))).toBeFalsy();
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#string
    describe('string validation keywords', () => {
      it('should support pattern', () => {
        const schema: JSONSchema7 = {
          type: 'string',
          pattern: 'Hello World!',
        };
        const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema);
        expect(to.pattern).toBe(schema.pattern);
      });

      it('should support minLength and maxLength', () => {
        const schema: JSONSchema7 = {
          type: 'string',
          minLength: 5,
          maxLength: 10,
        };
        const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema);
        expect(to.minLength).toBe(schema.minLength);
        expect(to.maxLength).toBe(schema.maxLength);
      });

      it('should set nullable string type to `null` if empty', () => {
        const schema: JSONSchema7 = {
          type: ['string', 'null'],
        };

        const { parsers: [nullIfEmpty] } = formlyJsonschema.toFieldConfig(schema);
        expect(nullIfEmpty('')).toBeNull();
        expect(nullIfEmpty('test')).toEqual('test');
      });
    });

    // TODO: Add support for contains
    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4
    describe('array validation keywords', () => {
      it('supports array items keyword as object', () => {
         const schema: JSONSchema7 = {
           type: 'array',
           items: { type: 'string' },
         };

         const config = formlyJsonschema.toFieldConfig(schema);

         const childConfig: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'string', defaultValue: undefined };
         const baseConfig: FormlyFieldConfig = {
            type: 'array',
            defaultValue: undefined,
            templateOptions: { ...emmptyTemplateOptions },
            fieldArray: childConfig,
            fieldGroup: [],
         };

         expect(config).toEqual(baseConfig);
      });

      it('supports array items as array of schemas', () => {
        const schema: JSONSchema7 = {
          type: 'array',
          items: [
            { type: 'string' },
            { type: 'number'},
          ],
        };

        const config = formlyJsonschema.toFieldConfig(schema);

        const childConfig: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'string', defaultValue: undefined };
        const childConfig2: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'number', defaultValue: undefined, parsers: [jasmine.any(Function)] };

        expect(config.type).toEqual('array');
        expect(config.fieldArray).toEqual(childConfig);
        // TODO: is this the best way to test this?
        // artificially increase the length of the fieldGroup
        // since the getter that is defined is based on that.
        config.fieldGroup.push(null);
        expect(config.fieldArray).toEqual(childConfig2);
        config.fieldGroup.push(null);
        expect(config.fieldArray).toEqual({});
      });

      it('supports array additionalitems wheh array items are defined as an array of schemas', () => {
        const schema: JSONSchema7 = {
          type: 'array',
          items: [
            { type: 'string' },
            { type: 'number'},
          ],
          additionalItems: { type: 'boolean' },
        };

        const config = formlyJsonschema.toFieldConfig(schema);

        const childConfig: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'string', defaultValue: undefined };
        const childConfig2: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'number', defaultValue: undefined, parsers: [jasmine.any(Function)]};
        const childConfig3: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'boolean', defaultValue: undefined };

        expect(config.fieldArray).toEqual(childConfig);
        // TODO: is this the best way to test this?
        // artificially increase the length of the fieldGroup
        // since the getter that is defined is based on that.
        config.fieldGroup.push(null);
        expect(config.fieldArray).toEqual(childConfig2);
        config.fieldGroup.push(null);
        // should return the additional items schema when the fieldGroup's length
        // is greater than the number of items array config validatoins
        expect(config.fieldArray).toEqual(childConfig3);
        expect(config.type).toEqual('array');
      });

      it('should support minItems', () => {
        const numSchema: JSONSchema7 = {
          type: 'array',
          minItems: 2,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.templateOptions.minItems).toBe(numSchema.minItems);

        const minItemsValidator = config.validators.minItems;
        expect(minItemsValidator).toBeDefined();
        expect(minItemsValidator(new FormControl([1]))).toBeFalsy();
        expect(minItemsValidator(new FormControl([]))).toBeFalsy();
        expect(minItemsValidator(new FormControl([1, 2]))).toBeTruthy();
        expect(minItemsValidator(new FormControl([1, 2, 3]))).toBeTruthy();
      });

      it('should support maxItems', () => {
        const numSchema: JSONSchema7 = {
          type: 'array',
          maxItems: 2,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.templateOptions.maxItems).toBe(numSchema.maxItems);

        const maxItemsValidator = config.validators.maxItems;
        expect(maxItemsValidator).toBeDefined();
        expect(maxItemsValidator(new FormControl([1, 2, 3]))).toBeFalsy();
        expect(maxItemsValidator(new FormControl([1, 2]))).toBeTruthy();
        expect(maxItemsValidator(new FormControl([]))).toBeTruthy();
      });

      it('should support uniqueItems', () => {
        const numSchema: JSONSchema7 = {
          type: 'array',
          uniqueItems: true,
        };
        const config = formlyJsonschema.toFieldConfig(numSchema);
        expect(config.templateOptions.uniqueItems).toBeTruthy();

        const uniqueItemsValidator = config.validators.uniqueItems;
        expect(uniqueItemsValidator).toBeDefined();
        expect(uniqueItemsValidator(new FormControl(null))).toBeTruthy();
        expect(uniqueItemsValidator(new FormControl([1, 2, 3]))).toBeTruthy();
        expect(uniqueItemsValidator(new FormControl([1, 2, 2]))).toBeFalsy();

        expect(uniqueItemsValidator(new FormControl([{ a: 2 }, { a: 1 }]))).toBeTruthy();
        expect(uniqueItemsValidator(new FormControl([{ a: 1 }, { a: 1 }]))).toBeFalsy();
      });
    });

    // TODO: complete support for Object validation keywords
    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5
    describe('object validation keywords', () => {
      it('supports properties and required keywords as well as nested objects', () => {
        const schema: JSONSchema7 = {
          type: 'object',
          required: ['requiredField'],
          properties: {
            requiredField: { type: 'string' },
            notRequired: { type: 'number' },
            nested: {
              type: 'object',
              properties: {
                nestedProp: { type: 'string' },
              },
            },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema);

        const child1: FormlyFieldConfig = {
          type: 'string',
          key: 'requiredField',
          templateOptions: { ...emmptyTemplateOptions, required: true },
          defaultValue: undefined,
        };

        const child2: FormlyFieldConfig = {
          type: 'number',
          key: 'notRequired',
          templateOptions: { ...emmptyTemplateOptions },
          defaultValue: undefined,
          parsers: [jasmine.any(Function)],
        };

        const nestedProp: FormlyFieldConfig = {
          type: 'string',
          key: 'nestedProp',
          templateOptions: { ...emmptyTemplateOptions },
          defaultValue: undefined,
        };

        const nested: FormlyFieldConfig = {
          type: 'object',
          key: 'nested',
          templateOptions: {...emmptyTemplateOptions },
          defaultValue: undefined,
          fieldGroup: [nestedProp],
        };

        expect(config.fieldGroup[0]).toEqual(child1);
        expect(config.fieldGroup[1]).toEqual(child2);
        expect(config.fieldGroup[2]).toEqual(nested);
      });

      describe('dependencies', () => {
        describe('with property dependencies', () => {
          it('should ignore required properties if required is defined', () => {
            const schema: JSONSchema7 = {
              'type': 'object',
              'properties': {
                'credit_card': { 'type': 'number' },
                'billing_address': { 'type': 'string' },
              },
              'required': ['credit_card'],
              'dependencies': {
                'credit_card': ['billing_address'],
              },
            };

            const config = formlyJsonschema.toFieldConfig(schema).fieldGroup;

            expect(config[0].templateOptions.required).toBeTruthy();
            expect(config[0].expressionProperties).toBeUndefined();
          });

          it('should add required properties', () => {
            const schema: JSONSchema7 = {
              'type': 'object',
              'properties': {
                'credit_card': { 'type': 'number' },
                'billing_address': { 'type': 'string' },
              },
              'dependencies': {
                'credit_card': ['billing_address'],
              },
            };

            const config = formlyJsonschema.toFieldConfig(schema).fieldGroup;
            const requiredExpr = config[1].expressionProperties['templateOptions.required'] as any;
            expect(requiredExpr({ credit_card: null })).toBeFalsy();
            expect(requiredExpr({ credit_card: 121223233 })).toBeTruthy();
          });
        });

        it('with schema dependencies', () => {
          const schema: JSONSchema7 = {
            'type': 'object',
            'properties': {
              'credit_card': { 'type': 'number' },
            },
            'dependencies': {
              'credit_card': {
                'properties': {
                  'billing_address': { 'type': 'string' },
                },
                'required': ['billing_address'],
              },
            },
          };

          const config = formlyJsonschema.toFieldConfig(schema).fieldGroup;
          const hideExpr = config[1].hideExpression as any;
          expect(hideExpr({ credit_card: null })).toBeTruthy();
          expect(hideExpr({ credit_card: 121223233 })).toBeFalsy();
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

          const enumOptions = schemaEnum => schemaEnum.map(value => ({ value, label: value }));

          // labelProp and valueProp should be a function that returns what it is given
          const config = formlyJsonschema.toFieldConfig(schemaStringEnum);
          expect(config.type).toBe('enum');
          expect(config.templateOptions.options).toEqual(enumOptions(schemaStringEnum.enum));

          const config2 = formlyJsonschema.toFieldConfig(schemaNumberEnum);
          expect(config2.parsers).toEqual([jasmine.any(Function)]);
          expect(config2.type).toBe('enum');
          expect(config2.templateOptions.options).toEqual(enumOptions(schemaNumberEnum.enum));

          const config3 = formlyJsonschema.toFieldConfig(schemaIntegerEnum);
          expect(config3.parsers).toEqual([jasmine.any(Function)]);
          expect(config3.type).toBe('enum');
          expect(config3.templateOptions.options).toEqual(enumOptions(schemaIntegerEnum.enum));
        });

        // https://github.com/json-schema-org/json-schema-spec/issues/57#issuecomment-247861695
        describe('enum as oneOf/anyOf structure', () => {
          it('should support enum as oneOf/const structure', () => {
            const schema: JSONSchema7 = {
              type: 'number',
              oneOf: [{ title: '1', const: 1 }, { title: '2', const: 2 }],
            };

            const { type, templateOptions: { options } } = formlyJsonschema.toFieldConfig(schema);

            expect(type).toEqual('enum');
            expect(options).toEqual([{ label: '1', value: 1 }, { label: '2', value: 2 }]);
          });

          it('should support enum as oneOf/enum structure', () => {
            const schema: JSONSchema7 = {
              type: 'number',
              oneOf: [{ title: '1', enum: [1] }, { title: '2', enum: [2] }],
            };

            const { type, templateOptions: { options } } = formlyJsonschema.toFieldConfig(schema);

            expect(type).toEqual('enum');
            expect(options).toEqual([{ label: '1', value: 1 }, { label: '2', value: 2 }]);
          });

          it('should support enum as anyOf structure', () => {
            const schema: JSONSchema7 = {
              type: 'number',
              anyOf: [{ title: '1', enum: [1] }, { title: '2', enum: [2] }],
            };

            const { type, templateOptions: { options } } = formlyJsonschema.toFieldConfig(schema);

            expect(type).toEqual('enum');
            expect(options).toEqual([{ label: '1', value: 1 }, { label: '2', value: 2 }]);
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
            const { type, validators, templateOptions: to } = formlyJsonschema.toFieldConfig(numSchema);

            expect(type).toEqual('enum');
            expect(to.multiple).toBeTruthy();
            expect(validators.uniqueItems).toBeDefined();
          });

          it('with nested item schema definition', () => {
            const numSchema: JSONSchema7 = {
              'definitions': {
                'foo': {
                  'type': 'string',
                  oneOf: [{ title: '1', const: 1 }, { title: '2', const: 2 }],
                },
              },
              type: 'array',
              uniqueItems: true,
              items: { '$ref': '#/definitions/foo' },
            };

            const { type, templateOptions: to } = formlyJsonschema.toFieldConfig(numSchema);
            expect(type).toEqual('enum');
            expect(to.multiple).toBeTruthy();
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
        const { type, defaultValue, validators: { const: constValidator } } = formlyJsonschema.toFieldConfig(schema);

        expect(type).toEqual('string');
        expect(defaultValue).toBeUndefined();

        expect(constValidator).toBeDefined();
        expect(constValidator(new FormControl(null))).toBeFalsy();
        expect(constValidator(new FormControl(4))).toBeFalsy();
        expect(constValidator(new FormControl('const'))).toBeTruthy();
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.9
    describe('Schema Re-Use With "definitions"', () => {
      it('should resolve a schema definition', () => {
        const schema: JSONSchema7 = {
          'definitions': {
            'address': { 'type': 'string' },
          },
          'type': 'object',
          'properties': {
            'billing_address': { '$ref': '#/definitions/address' },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.fieldGroup[0]).toEqual({
          key: 'billing_address',
          type: 'string',
          defaultValue: undefined,
          templateOptions: emmptyTemplateOptions,
        });
      });

      it('should use the locally defined annotations', () => {
        const schema: JSONSchema7 = {
          'definitions': {
            'address': {
              'type': 'string',
              'title': 'Address',
              'description': 'default address',
              'default': 'Foo',
            },
          },
          'type': 'object',
          'properties': {
            'billing_address': {
              '$ref': '#/definitions/address',
              'title': 'Billing address',
              'description': 'default billing address',
              'default': 'bar',
            },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        const addressField = config.fieldGroup[0];
        expect(addressField.templateOptions.label).toEqual('Billing address');
        expect(addressField.templateOptions.description).toEqual('default billing address');
        expect(addressField.defaultValue).toEqual('bar');
      });

      it('should resolve a nested schema definition', () => {
        const schema: JSONSchema7 = {
          'definitions': {
            'address1': { '$ref': '#/definitions/address2', 'title': 'address1' },
            'address2': { 'type': 'string', 'title': 'address2' },
          },
          'type': 'object',
          'properties': {
            'address': { '$ref': '#/definitions/address1' },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.fieldGroup[0]).toEqual({
          key: 'address',
          type: 'string',
          defaultValue: undefined,
          templateOptions: {
            ...emmptyTemplateOptions,
            label: 'address1',
          },
        });
      });

      it('should resolve a recusive schema definition', () => {
        const schema: JSONSchema7 = {
          'definitions': {
            'person': {
              'type': 'array',
              'items': { '$ref': '#/definitions/person' },
            },
          },

          'type': 'object',

          'properties': {
            'person': { '$ref': '#/definitions/person' },
          },
        };

        const config = formlyJsonschema.toFieldConfig(schema).fieldGroup[0];

        const expectedConfig = {
          type: 'array',
          defaultValue: undefined,
          templateOptions: emmptyTemplateOptions,
          fieldGroup: [],
          fieldArray: jasmine.any(Object) as any,
        };

        expect(config.fieldArray).toEqual(expectedConfig);
        expect(config.fieldArray.fieldArray).toEqual(expectedConfig);
        expect(config.fieldArray.fieldArray.fieldArray).toEqual(expectedConfig);

      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7
    describe('Schema allOf support', () => {
      it('should merge allOf array into single object', () => {
        const schema: JSONSchema7 = {
          'definitions': {
            'address': {
              'type': 'object',
              'properties': {
                'street_address': { 'type': 'string' },
                'city':           { 'type': 'string' },
                'state':          { 'type': 'string' },
              },
              'required': ['street_address', 'city', 'state'],
            },
          },
          'type': 'object',
          'properties': {
            'billing_address': {
              allOf: [
                {'$ref': '#/definitions/address'},
                { 'properties': {
                    'type': { 'enum': [ 'residential', 'business' ] },
                  },
                },
              ],
            },
          },
        };
        const { fieldGroup } = formlyJsonschema.toFieldConfig(schema);
        const expected = fieldGroup[0].fieldGroup.map(({key, type, templateOptions: { required } }) => ({ key, type, required }));
        expect(expected).toEqual([
          { key: 'street_address', type: 'string', required: true },
          { key: 'city', type: 'string', required: true },
          { key: 'state', type: 'string', required: true },
          { key: 'type', type: 'enum', required: undefined },
        ]);
      });

      it('should handle nested allOf', () => {
        const schema: JSONSchema7 = {
          'definitions': {
            'baseAddress': {
              'type': 'object',
              'properties': {
                'street_address': { 'type': 'string' },
                'city':           { 'type': 'string' },
                'state':          { 'type': 'string' },
              },
              'required': ['street_address', 'city', 'state'],
            },
            'mailingAddress': {
              allOf: [
                {'$ref': '#/definitions/baseAddress'},
                { 'properties': {
                    'country': { 'type': 'string' },
                  },
                },
              ],
            },
          },
          'type': 'object',
          'properties': {
            'billing_address': {
              allOf: [
                {'$ref': '#/definitions/mailingAddress'},
                { 'properties': {
                    'type': { 'enum': [ 'residential', 'business' ] },
                  },
                },
              ],
            },
          },
        };
        const { fieldGroup } = formlyJsonschema.toFieldConfig(schema);
        const expected = fieldGroup[0].fieldGroup.map(({key, type, templateOptions: { required } }) => ({ key, type, required }));
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
          'allOf': [
            {
              'properties': { 'firstname': {'type': 'string'} },
              'required': ['firstname'],
            },
            {
              'properties': { 'lastname': {'type': 'string'} },
              'required': ['lastname'],
            },
          ],
        };
        const { fieldGroup } = formlyJsonschema.toFieldConfig(schema);
        const expected = fieldGroup.map(({key, templateOptions: { required } }) => ({ key, required }));
        expect(expected).toEqual([
          { key: 'firstname', required: true },
          { key: 'lastname', required: true },
        ]);
      });

      it('should merge allOf with base schema', () => {
        const schema: JSONSchema7 = {
          'properties': { 'firstname': {'type': 'string'} },
          'required': ['firstname'],
          'allOf': [
            {
              'properties': { 'familyname': {'type': 'string'} },
              'required': ['familyname'],
            },
            {
              'properties': { 'lastname': {'type': 'string'} },
              'required': ['lastname'],
            },
          ],
        };
        const { fieldGroup } = formlyJsonschema.toFieldConfig(schema);
        const expected = fieldGroup.map(({key, templateOptions: { required } }) => ({ key, required }));
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
            allOf: [
              { uniqueItems: false },
              { uniqueItems: true },
            ],
          };
          const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema);
          expect(to.uniqueItems).toBeTruthy();
        });

        it('minLength', () => {
          const schema: JSONSchema7 = {
            type: 'string',
            allOf: [
              { minLength: 10 },
              { minLength: 100 },
            ],
          };
          const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema);
          expect(to.minLength).toEqual(100);
        });

        it('maxLength', () => {
          const schema: JSONSchema7 = {
            type: 'string',
            allOf: [
              { maxLength: 10 },
              { maxLength: 100 },
            ],
          };
          const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema);
          expect(to.maxLength).toEqual(10);
        });
      });
    });

    describe('Multi-Schema (oneOf, anyOf) support', () => {
      let schema: JSONSchema7;
      let builder: FormlyFormBuilder;

      beforeEach(() => {
        const TestComponent = MockComponent({ selector: 'formly-test-cmp' });
        TestBed.configureTestingModule({
          declarations: [TestComponent],
          imports: [
            FormlyModule.forRoot({
              types: [
                { name: 'object', component: TestComponent },
                { name: 'multischema', component: TestComponent },
                { name: 'enum', component: TestComponent },
                { name: 'string', component: TestComponent },
              ],
            }),
          ],
        });
      });

      beforeEach(inject([FormlyFormBuilder], (formlyBuilder: FormlyFormBuilder) => {
        builder = formlyBuilder;
        schema = {
          type: 'object',
          oneOf: [
            {
              properties: { foo: { type: 'string' } },
              required: ['foo'],
            },
            { properties: { bar: { type: 'string' } } },
          ],
          anyOf: [
            { properties: { foo: { type: 'string' } } },
            { properties: { bar: { type: 'string' } } },
          ],
        };
      }));

      it('should render multischema type when oneOf/anyOf is present', () => {
        const { fieldGroup: [{ type: oneOfType }, { type: anyOfType }] } = formlyJsonschema.toFieldConfig(schema);
        expect(oneOfType).toEqual('multischema');
        expect(anyOfType).toEqual('multischema');
      });

      it('should render the valid oneOf field on first render', fakeAsync(() => {
        const { fieldGroup: [f] } = formlyJsonschema.toFieldConfig(schema);

        builder.buildForm(new FormGroup({}), [f], {}, {});
        const [enumField, { fieldGroup: [fooField, barField] }] = f.fieldGroup;
        enumField.hooks.onInit(enumField);
        tick();

        expect(fooField.hide).toBeTruthy();
        expect(barField.hide).toBeFalsy();

        enumField.formControl.setValue(0);

        expect(fooField.hide).toBeFalsy();
        expect(barField.hide).toBeTruthy();
      }));
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
        const { defaultValue, templateOptions: to } = formlyJsonschema.toFieldConfig(schema);
        expect(to.label).toBe(schema.title);
        expect(defaultValue).toBe(schema.default);
        expect(to.description).toBe(schema.description);
        expect(to.readonly).toBe(schema.readOnly);
      });
    });
  });

  describe('widget formlyConfig options merging', () => {
    it('should merge a formlyConfig object specified in the widget property into the formly config', () => {
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

      const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema);
      expect(to.label).toBe('Age');
    });

    it('should override properties that have already been set', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "type": "integer",
        "title": "Person Age",
        "widget": {
          "formlyConfig": {
            "templateOptions": {
              "label": "Age"
            }
          }
        }
      }`);

      const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema);

      expect(to.label).toBe('Age');
    });
  });

  describe('FormlyJsonSchemaOptions map function', () => {
    it('should allow to pass in a "map" function to further customize the mapping', () => {
      const schema: JSONSchema7 = JSON.parse(`{
        "type": "integer",
        "title": "Person Age",
        "widget": {
          "formlyConfig": {
            "templateOptions": {
              "label": "Age"
            }
          }
        }
      }`);

      const { templateOptions: to } = formlyJsonschema.toFieldConfig(schema, {
        map: (field: FormlyFieldConfig, mapSource: JSONSchema7) => {
          // not a very real-world mapping scenario 😊
          if (field.type === 'integer') {
            field.templateOptions.label = 'my custom label';
          }

          return field;
        },
      });

      expect(to.label).toBe('my custom label');
    });
  });
});
