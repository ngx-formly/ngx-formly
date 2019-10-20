import { FormlyFieldConfig, FormlyFieldConfigCache } from '../../components/formly.field.config';
import { MockComponent, createBuilder } from '../../test-utils';
import { Subject } from 'rxjs';

function buildField({ model, options, ...field }: FormlyFieldConfig): FormlyFieldConfigCache {
  const builder = createBuilder({
    extensions: ['core'],
    onInit: c => c.addConfig({
      types: [
        {
          name: 'input',
          wrappers: ['form-field'],
          component: MockComponent({ selector: 'formly-test-cmp' }),
        },
      ],
    }),
  });

  builder.buildField({
    model: model || {},
    options,
    fieldGroup: [field],
  });

  return field;
}

describe('CoreExtension', () => {
  it('should assign default templateOptions when empty', () => {
    const { fieldGroup: [withoutType, withType] } = buildField({
      fieldGroup: [
        {key: 'title'},
        {key: 'title', type: 'input'},
      ],
    });

    expect(withoutType.templateOptions).toEqual({});
    expect(withType.templateOptions).toEqual({
      label: '',
      placeholder: '',
      focus: false,
      disabled: false,
    });
  });

  it('should assign default type (template, fieldGroup) when empty', () => {
    const { type, fieldGroup: [{ type: templateType }] } = buildField({
      key: 'title',
      fieldGroup: [
        { template: 'test' },
      ],
    });

    expect(type).toEqual('formly-group');
    expect(templateType).toEqual('formly-template');
  });

  describe('field defaultValue', () => {
    it('should not set the defaultValue if the model value is defined', () => {
      const field = buildField({
        key: 'title',
        defaultValue: 'test',
        model: { title: 'title' },
      });

      expect(field.model.title).toEqual('title');
    });

    it('should set the defaultValue if the model value is not defined', () => {
      const field = buildField({
        key: 'title',
        defaultValue: false,
      });

      expect(field.model.title).toBeFalsy();
    });

    it('should set the defaultValue for nested key', () => {
      const field = buildField({
        key: 'address.city',
        defaultValue: 'foo',
      });

      expect(field.model.address).toEqual({ city: 'foo' });
    });

    it('should set the defaultValue for nested form', () => {
      const field = buildField({
        key: 'address',
        defaultValue: {},
        fieldGroup: [
          {
            key: 'city',
            defaultValue: 'foo',
          },
        ],
      });

      expect(field.model).toEqual({ city: 'foo' });
    });

    it('should set the defaultValue when fieldGroup is set', () => {
      const field = buildField({
        key: 'address',
        defaultValue: { foo: 'foo' },
        fieldGroup: [],
      });

      expect(field.model).toEqual({ foo: 'foo' });
    });

    it('fieldGroup without def defaultValue', () => {
      const field = buildField({
        key: 'address',
        fieldGroup: [],
      });

      expect(field.model).toBeUndefined();
    });
  });

  it('should init root options', () => {
    const field = buildField({
      options: {},
    });

    expect(field.options).toEqual(jasmine.objectContaining({
      formState: {},
      showError: jasmine.any(Function),
      updateInitialValue: jasmine.any(Function),
      fieldChanges: jasmine.any(Subject),
      _markForCheck: jasmine.any(Function),
      resetModel: jasmine.any(Function),
    }));
  });

  it('should assign parent options to children', () => {
    const field = buildField({
      key: 'address',
      fieldGroup: [{
        key: 'city',
      }],
    });

    expect(field.fieldGroup[0].model).toEqual(field.model);
    expect(field.fieldGroup[0].options).toEqual(field.options);
    expect(field.fieldGroup[0].parent).toEqual(field);
    expect(field.fieldGroup[0]['index']).toEqual(0);
  });

  describe('assign model to fields', () => {
    it('with simple field', () => {
      const model = { city: 'foo' };
      const field = buildField({
        key: 'city',
        model,
      });

      expect(field.model).toEqual(model);
    });

    describe('with fieldGroup', () => {
      it('fieldGroup without key', () => {
        const model = { city: 'foo' };
        const field = buildField({
          model,
          fieldGroup: [{
            key: 'city',
          }],
        });

        expect(field.model).toEqual(model);
        expect(field.fieldGroup[0].model).toEqual(model);
      });

      it('fieldGroup with key', () => {
        const model = {
          address: { city: 'foo' },
        };
        const field = buildField({
          model,
          key: 'address',
          fieldGroup: [{
            key: 'city',
          }],
        });

        expect(field.model).toEqual(model.address);
        expect(field.fieldGroup[0].model).toEqual(model.address);
      });

      it('fieldGroup with nested key', () => {
        const model = {
          location: { address: { city: 'foo' } },
        };
        const field = buildField({
          model,
          key: 'location.address',
          fieldGroup: [{
            key: 'city',
          }],
        });

        expect(field.model).toEqual(model.location.address);
        expect(field.fieldGroup[0].model).toEqual(model.location.address);
      });
    });
  });

  describe('initialise Wrappers', () => {
    it('should use an empty array if wrappers is not set', () => {
      const field = buildField({ key: 'title' });
      expect(field.wrappers).toEqual([]);
    });

    it('should add default wrappers if type is provided', () => {
      const field = buildField({ type: 'input' });
      expect(field.wrappers).toEqual(['form-field']);
    });

    it('should not override wrappers if wrappers is not set', () => {
      const field = buildField({ type: 'input', wrappers: ['form-field-custom'] });
      expect(field.wrappers).toEqual(['form-field-custom']);
    });

    it('should add preWrapper and postWrapper', () => {
      const field = buildField({
        key: 'title',
        wrappers: ['wrapper'],
        templateOptions: {
          templateManipulators: {
            preWrapper: [() => 'preWrapper'],
            postWrapper: [() => 'postWrapper'],
          },
        },
      });

      expect(field.wrappers).toEqual(['preWrapper', 'wrapper', 'postWrapper']);
    });
  });

  describe('generate field id', () => {
    it('should not generate id if it is defined', () => {
      const field = buildField({ key: 'title', id: 'title_id' });

      expect(field.id).toEqual('title_id');
    });

    it('should generate id if it is not defined', () => {
      const field = buildField({ key: 'title' });

      expect(field.id).toEqual('formly_1__title_0');
    });

    it('should take account of field index', () => {
      const { fieldGroup: [f1, f2] } = buildField({
        fieldGroup: [
          { key: 'title' },
          { key: 'title' },
        ],
      });

      expect(f1.id).toEqual('formly_3__title_0');
      expect(f2.id).toEqual('formly_3__title_1');
    });
  });
});
