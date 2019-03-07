
import { FormlyJsonschema } from './formly-json-schema.service';
import { JSONSchema7 } from 'json-schema';
import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';

describe('Service: FormlyJsonschema', () => {
  let formlyJsonschema: FormlyJsonschema;
  const emmptyTemplateOptions: FormlyTemplateOptions = {
    min: undefined,
    max: undefined,
    minLength: undefined,
    maxLength: undefined,
    label: undefined,
    readonly: undefined,
    pattern: undefined,
    description: undefined,
  };
  beforeEach(() => {
    formlyJsonschema = new FormlyJsonschema();
  });

  describe('keyword support', () => {
    // TODO: Add support for exclusiveMinimum, exclusiveMaximum and multipleOf
    // https://json-schema.org/latest/json-schema-validation.html#numeric
    describe('number validation keywords', () => {
      it('should support minimum and maximum', () => {
        const numSchema: JSONSchema7 = {
          type: 'number',
          minimum: 5,
          maximum: 10,
        };
        const formlyConfig = formlyJsonschema.toFieldConfig(numSchema);
        expect(formlyConfig.templateOptions.min).toBe(numSchema.minimum);
        expect(formlyConfig.templateOptions.max).toBe(numSchema.maximum);
      });
    });

    // https://json-schema.org/latest/json-schema-validation.html#string
    describe('string validation keywords', () => {
      it('should support pattern', () => {
        const stringSchema: JSONSchema7 = {
          type: 'string',
          pattern: 'Hello World!',
        };
        const formlyConfig = formlyJsonschema.toFieldConfig(stringSchema);
        expect(formlyConfig.templateOptions.pattern).toBe(stringSchema.pattern);
      });

      it('should support minLength and maxLength', () => {
        const stringSchema: JSONSchema7 = {
          type: 'string',
          minLength: 5,
          maxLength: 10,
        };
        const formlyConfig = formlyJsonschema.toFieldConfig(stringSchema);
        expect(formlyConfig.templateOptions.minLength).toBe(stringSchema.minLength);
        expect(formlyConfig.templateOptions.maxLength).toBe(stringSchema.maxLength);
      });
    });

    // TODO: Add support for minItems, maxItems, uniqueItems, contains
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
        const childConfig2: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'number', defaultValue: undefined };

        expect(config.fieldArray).toEqual(childConfig);
        // TODO: is this the best way to test this?
        // artificially increase the length of the fieldGroup
        // since the getter that is defined is based on that.
        config.fieldGroup.push(null);
        expect(config.fieldArray).toEqual(childConfig2);
        expect(config.type).toEqual('array');
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
        const childConfig2: FormlyFieldConfig = { templateOptions: { ...emmptyTemplateOptions }, type: 'number', defaultValue: undefined };
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

      it('should support enum as strig array values', () => {
        const schemaStringEnum: JSONSchema7 = {
          type: 'string',
          enum: ['The', 'Best', 'Forms',
          ],
        };

        const schemaNumberEnum: JSONSchema7 = {
          type: 'number',
          enum: [1, 1.233333, 42, 1234163],
        };

        const schemaIntegerEnum: JSONSchema7 = {
          type: 'integer',
          enum: [1, 2, 3, 4, 5],
        };

        // labelProp and valueProp should be a function that returns what it is given
        const config = formlyJsonschema.toFieldConfig(schemaStringEnum);
        expect(config.type).toBe('enum');
        expect(config.templateOptions.options).toEqual(schemaStringEnum.enum);
        expect(config.templateOptions.labelProp('test')).toBe('test');
        expect(config.templateOptions.valueProp('test')).toBe('test');

        const config2 = formlyJsonschema.toFieldConfig(schemaNumberEnum);
        expect(config2.parsers).toEqual([Number]);
        expect(config2.type).toBe('enum');
        expect(config2.templateOptions.options).toEqual(schemaNumberEnum.enum);
        expect(config2.templateOptions.labelProp('test')).toBe('test');
        expect(config2.templateOptions.valueProp('test')).toBe('test');

        const config3 = formlyJsonschema.toFieldConfig(schemaIntegerEnum);
        expect(config3.parsers).toEqual([Number]);
        expect(config3.type).toBe('enum');
        expect(config3.templateOptions.options).toEqual(schemaIntegerEnum.enum);
        expect(config3.templateOptions.labelProp('test')).toBe('test');
        expect(config3.templateOptions.valueProp('test')).toBe('test');
      });

      // TODO: add support for adding custom labels to enum values using oneOf/const
      // https://github.com/json-schema-org/json-schema-spec/issues/57#issuecomment-247861695
      // it('should support enum as oneOf structure', () => {
      //   const schema: JSONSchema7 = {
      //     type: 'number',
      //   };

      //   const config = formlyJsonschema.toFieldConfig(schema);
      // });

      // TODO: discuss const support possibly as hidden, already set field
      // it('should support cosnt', () => {
      //   const schema: JSONSchema7 = {
      //     type: 'string',
      //     const: 'string Const',
      //   };

      //   const config = formlyJsonschema.toFieldConfig(schema);
      // });
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
        const config = formlyJsonschema.toFieldConfig(schema);
        expect(config.templateOptions.label).toBe(schema.title);
        expect(config.defaultValue).toBe(schema.default);
        expect(config.templateOptions.description).toBe(schema.description);
        expect(config.templateOptions.readonly).toBe(schema.readOnly);
      });
    });
  });
});
