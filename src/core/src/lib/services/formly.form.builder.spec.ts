import { TestBed, inject } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormlyFormBuilder, FormlyConfig, FormlyFieldConfig, FieldArrayType } from '../core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MockComponent } from '../test-utils';
import { FormlyFieldConfigCache } from '../components/formly.field.config';
import { FormlyModule } from '../core.module';

describe('FormlyFormBuilder service', () => {
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let TestComponent: Component;
  let config: FormlyConfig;

  beforeEach(() => {
    TestComponent = MockComponent({ selector: 'formly-test-cmp' });
    TestBed.configureTestingModule({
      declarations: [TestComponent, RepeatComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            { name: 'input', component: TestComponent },
            { name: 'array', component: RepeatComponent },
          ],
          wrappers: [{ name: 'label', component: TestComponent, types: ['input'] }],
          validators: [{ name: 'required', validation: Validators.required }],
        }),
      ],
    });
  });

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
  }));

  it('custom extension', () => {
    const customExtension: any = {
      prePopulate: () => { },
      onPopulate: () => { },
      postPopulate: () => { },
    };
    config.extensions.custom = customExtension;

    spyOn(customExtension, 'prePopulate');
    spyOn(customExtension, 'onPopulate');
    spyOn(customExtension, 'postPopulate');

    builder.buildForm(form, [], {}, {});
    expect(customExtension.prePopulate).toHaveBeenCalledBefore(customExtension.onPopulate);
    expect(customExtension.onPopulate).toHaveBeenCalledBefore(customExtension.postPopulate);
    expect(customExtension.postPopulate).toHaveBeenCalled();
  });

  it('should have the model accessible from the field itself', () => {
    const fields: FormlyFieldConfig[] = [
      { key: 'test', type: 'input', hide: true },
      { key: 'test', type: 'input' },
    ];
    const model = {};
    builder.buildForm(form, fields, model, {});
    expect(fields[0].model).toEqual(model);
  });

  describe('formcontrol', () => {
    it('should create FormGroup control when nested form is set', () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'test', type: 'input', fieldGroup: [] },
      ];

      builder.buildForm(form, fields, {}, {});
      expect(fields[0].formControl instanceof FormGroup).toBeTruthy();
    });

    it('should create FormArray control when fieldArray is set', () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'test', type: 'array', fieldArray: {} },
      ];

      builder.buildForm(form, fields, {}, {});
      expect(fields[0].formControl instanceof FormArray).toBeTruthy();
    });

    it('should use the same formcontrol for fields that use the same key', () => {
      const fields: FormlyFieldConfig[] = [
        { key: 'test', type: 'input', hide: true },
        { key: 'test', type: 'input' },
      ];

      builder.buildForm(form, fields, {}, {});
      expect(fields[0].formControl).toEqual(fields[1].formControl);
    });

    it('should not override existing formcontrol validation when re-build form', () => {
      form.addControl('test', new FormControl());
      const fields: FormlyFieldConfig[] = [
        { key: 'test', type: 'input' },
      ];

      builder.buildForm(form, fields, {}, {});
      fields[0].formControl.setValidators(Validators.required);
      fields[0].formControl.updateValueAndValidity();

      builder.buildForm(form, fields, {}, {});
      expect(form.valid).toBeFalsy();
    });

    it('should updateValueAndValidity of detached field', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'test',
          hide: true,
          formControl: new FormControl(),
          templateOptions: { required: true },
        },
      ];

      const control = fields[0].formControl;
      spyOn(control, 'updateValueAndValidity');

      builder.buildForm(form, fields, {}, {});
      expect(form.get('test')).toBeNull();
      expect(control.updateValueAndValidity).toHaveBeenCalled();
    });

    it('should update the formcontrol validation for a built form', () => {
      form.addControl('test', new FormControl());
      const fields: FormlyFieldConfig[] = [
        { key: 'test', type: 'input', templateOptions: { required: true } },
      ];

      builder.buildForm(form, fields, {}, {});
      expect(form.valid).toBeFalsy();
    });

    it('should update the formcontrol value for fields that already has formcontrol', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'test',
          type: 'input',
          formControl: new FormControl(),
        },
        {
          key: 'fieldGroup',
          type: 'input',
          formControl: new FormGroup({ aa: new FormControl('aa') }),
        },
        {
          key: 'fieldArray',
          type: 'array',
          formControl: new FormArray([new FormControl('aa')]),
        },
      ];

      builder.buildForm(form, fields, { test: 'test' }, {});
      expect(fields[0].formControl.value).toEqual('test');
      expect(fields[1].formControl.value).toEqual({ aa: 'aa' });
      expect(fields[2].formControl.value).toEqual(['aa']);
    });
  });

  describe('initialise Wrappers', () => {
    it('should use an empty array if Wrappers is not set', () => {
      field = { key: 'title' };
      builder.buildForm(form, [field], {}, {});

      expect(field.wrappers).toEqual([]);
    });

    it('should add preWrapper and postWrapper', () => {
      field = {
        key: 'title',
        wrappers: ['wrapper'],
        templateOptions: {
          templateManipulators: {
            preWrapper: [() => 'preWrapper'],
            postWrapper: [() => 'postWrapper'],
          },
        },
      };
      builder.buildForm(form, [field], {}, {});

      // preWrapper and postWrapper should be applied only once when rebuild form
      builder.buildForm(form, [field], {}, {});

      expect(field.wrappers).toEqual(['preWrapper', 'wrapper', 'postWrapper']);
    });
  });

  describe('initialise default TemplateOptions', () => {
    it('should set the default value if the specified key and type is defined', () => {
      field = { key: 'title', type: 'input', templateOptions: { placeholder: 'Title' } };
      builder.buildForm(form, [field], {}, {});

      expect(field.templateOptions).toEqual(<any> { label: '', placeholder: 'Title', focus: false, disabled: false });
    });

    it('should set the default value if the specified key and type is defined for fieldGroup', () => {
      field = {
        key: 'fieldgroup',
        fieldGroup: [{ key: 'title', type: 'input', templateOptions: { placeholder: 'Title' } }],
      };
      builder.buildForm(form, [field], {}, {});
      expect(field.type).toEqual('formly-group');
      expect(field.fieldGroup[0].templateOptions).toEqual(<any> { label: '', placeholder: 'Title', focus: false, disabled: false });
    });
  });

  describe('templateOptions disabled state', () => {
    it('should disable sub-fields when parent is disabled', () => {
      const field: FormlyFieldConfig = {
        key: 'address',
        templateOptions: { disabled: true },
        fieldGroup: [
          { key: 'city' },
          { key: 'street' },
        ],
      };

      builder.buildForm(form, [field], {}, {});

      const control = field.formControl;
      expect(control.disabled).toEqual(true);
      expect(control.get('city').disabled).toEqual(true);
      expect(control.get('street').disabled).toEqual(true);
    });

    it('should not affect parent disabled state', () => {
      const field: FormlyFieldConfig = {
        key: 'address',
        fieldGroup: [
          { key: 'city', templateOptions: { disabled: true } },
          { key: 'street' },
        ],
      };

      builder.buildForm(form, [field], {}, {});

      const control = field.formControl;
      expect(control.disabled).toEqual(false);
      expect(control.get('city').disabled).toEqual(true);
      expect(control.get('street').disabled).toEqual(false);
    });
  });

  it('should enable previously disabled control', () => {
    let fields: FormlyFieldConfig[] = [
      {
        key: 'foo',
        templateOptions: { disabled: true },
      },
      {
        key: 'bar',
        templateOptions: { disabled: true },
      },
    ];

    builder.buildForm(form, fields, {}, {});

    expect(form.get('foo').disabled).toEqual(true);
    expect(form.get('bar').disabled).toEqual(true);

    fields = [
      {
        key: 'foo',
        templateOptions: { disabled: true },
      },
      { key: 'bar' },
    ];

    builder.buildForm(form, fields, {}, {});
    expect(form.get('foo').disabled).toEqual(true);
    expect(form.get('bar').disabled).toEqual(false);
  });

  describe('assign model to fields', () => {
    let fields: FormlyFieldConfig[],
      model: any;

    it('with simple field', () => {
      model = { city: 'foo' };
      fields = [{ key: 'city' }];

      builder.buildForm(form, fields, model, {});

      expect(fields[0].model).toEqual(model);
    });

    describe('with fieldGroup', () => {
      it('fieldGroup without key', () => {
        model = { city: 'foo' };
        fields = [{
          fieldGroup: [{
            key: 'city',
          }],
        }];

        builder.buildForm(form, fields, model, {});

        expect(fields[0].model).toEqual(model);
        expect(fields[0].fieldGroup[0].model).toEqual(model);
      });

      it('fieldGroup with key', () => {
        model = { address: { city: 'foo' } };
        fields = [{
          key: 'address',
          fieldGroup: [{
            key: 'city',
          }],
        }];

        builder.buildForm(form, fields, model, {});

        expect(fields[0].model).toEqual(model.address);
        expect(fields[0].fieldGroup[0].model).toEqual(model.address);
      });

      it('fieldGroup with nested key', () => {
        model = { location: { address: { city: 'foo' } } };
        fields = [{
          key: 'location.address',
          fieldGroup: [{
            key: 'city',
          }],
        }];

        builder.buildForm(form, fields, model, {});

        expect(fields[0].model).toEqual(model.location.address);
        expect(fields[0].fieldGroup[0].model).toEqual(model.location.address);
      });

      it('assign parent field to children', () => {
        model = { address: { city: 'foo' } };
        fields = [{
          key: 'address',
          fieldGroup: [{
            key: 'city',
          }],
        }];

        builder.buildForm(form, fields, model, {});

        expect(fields[0].model).toEqual(model.address);
        expect(fields[0].fieldGroup[0].model).toEqual(model.address);
        expect(fields[0].fieldGroup[0].parent).toEqual(fields[0]);
      });
    });
  });

  describe('initialise form', () => {
    it('should create nested form control when field key is nested', () => {
      const model = { address: { city: 'test' } };
      field = { key: 'address.city', type: 'input' };
      builder.buildForm(form, [field], model, {});

      expect(form.get('address.city')).toBeDefined();
      expect(form.get('address.city').value).toEqual('test');
      expect(model).toEqual({ address: { city: 'test' } });
    });

    it('should create nested form control for nested integer field key', () => {
      const model = { a: ['foo', 'bar']};
      field = { key: 'a.1', type: 'input' };
      builder.buildForm(form, [field], model, {});

      expect(form.get('a.1').value).toEqual('bar');
    });

    it('should create nested form control with fieldGroup', () => {
      const model = { a: { b: { c: 'foo' } }};
      field = {
        key: 'a.b',
        type: 'input',
        fieldGroup: [{ key: 'c', type: 'input' }],
      };
      builder.buildForm(form, [field], model, {});

      expect(form.get('a.b').value).toEqual({ c: 'foo' });
      expect(model).toEqual({ a: { b: { c: 'foo' } } });
    });
  });

  describe('field defaultValue', () => {
    it('should not set the defaultValue if the model value is defined', () => {
      const model = { title: 'title' };
      field = {
        key: 'title',
        type: 'input',
        defaultValue: 'test',
      };
      builder.buildForm(form, [field], model, {});

      expect(model['title']).toEqual('title');
    });

    it('should set the defaultValue if the model value is not defined', () => {
      const model = {};
      field = {
        key: 'title',
        type: 'input',
        defaultValue: false,
      };
      builder.buildForm(form, [field], model, {});

      expect(model['title']).toBeFalsy();
    });

    it('should set the defaultValue for nested key', () => {
      const model = {};
      field = {
        key: 'address.city',
        type: 'input',
        defaultValue: 'foo',
      };
      builder.buildForm(form, [field], model, {});

      expect(model['address']).toEqual({ city: 'foo' });
    });

    it('should set the defaultValue for nested form', () => {
      const model = {};
      field = {
        key: 'address',
        fieldGroup: [
          {
            key: 'city',
            type: 'input',
            defaultValue: 'foo',
          },
        ],
      };
      builder.buildForm(form, [field], model, {});

      expect(model['address']).toEqual({ city: 'foo' });
    });

    it('should set the defaultValue when fieldGroup is set', () => {
      const model = {};
      field = {
        key: 'address',
        defaultValue: { foo: 'foo' },
        fieldGroup: [],
      };
      builder.buildForm(form, [field], model, {});

      expect(model['address']).toEqual({ foo: 'foo' });
    });

    it('set empty object as defaultValue when fieldGroup is set', () => {
      const model = {};
      field = {
        key: 'address',
        fieldGroup: [],
      };
      builder.buildForm(form, [field], model, {});

      expect(model['address']).toEqual({});
    });

    it('set empty array as defaultValue when fieldArray is set', () => {
      const model = {};
      field = {
        key: 'address',
        type: 'array',
        fieldGroup: [],
        fieldArray: {
          fieldGroup: [
            { key: 'city', type: 'input' },
          ],
        },
      };
      builder.buildForm(form, [field], model, {});

      expect(model['address']).toEqual([]);
    });
  });

  describe('field expression', () => {
    it('should built field expression', () => {
      field = {
        key: 'title',
        hideExpression: '!model',
        expressionProperties: {
          'templateOptions.disabled': '!model',
          'templateOptions.label': (model) => !model ? 'Title *' : 'Title',
        },
      };

      builder.buildForm(form, [field], {}, {});
      const disabledExpression = (field as FormlyFieldConfigCache)._expressionProperties['templateOptions.disabled'];
      expect(typeof disabledExpression.expression).toBe('function');

      const labelExpression = (field as FormlyFieldConfigCache)._expressionProperties['templateOptions.label'];
      expect(typeof labelExpression.expression).toBe('function');

      expect(typeof field.hideExpression).toBe('function');
    });

    it('should execute field expression during form build', () => {
      field = {
        key: 'title',
        type: 'input',
        hideExpression: '!model',
        expressionProperties: {
          'templateOptions.disabled': 'undefined !== model',
          'templateOptions.label': (model) => !model ? 'Title *' : 'Title',
        },
        templateOptions: { disabled: false },
      };

      builder.buildForm(form, [field], {}, {});
      expect(field.templateOptions.disabled).toBeTruthy();
      expect(field.formControl.status).toEqual('DISABLED');

      expect(field.templateOptions.label).toEqual('Title');
    });

    it('should execute field with nested keys expression during form build ', () => {
      field = {
        key: 'address.city',
        type: 'input',
        hideExpression: '!model',
        expressionProperties: {
          'templateOptions.disabled': '!model.address.city',
        },
        templateOptions: { disabled: false },
      };

      builder.buildForm(form, [field], { address: {} }, {});
      expect(field.templateOptions.disabled).toBeTruthy();
      expect(field.formControl.status).toEqual('DISABLED');
    });
  });

  describe('generate field id', () => {
    it('should not generate id if it is defined', () => {
      field = { key: 'title', id: 'title_id' };
      builder.buildForm(form, [field], {}, {});

      expect(field.id).toEqual('title_id');
    });

    it('should generate id if it is not defined', () => {
    field = { key: 'title' };
    builder.buildForm(form, [field], {}, {});

    expect(field.id).toEqual('formly_1__title_0');
    });

    it('should generate an unique id for each form', () => {
      const field1 = { key: 'title' },
       field2 = { key: 'title' };

      builder.buildForm(form, [field1], {}, {});
      builder.buildForm(form, [field2], {}, {});

      expect(field1['id']).not.toEqual(field2['id']);
    });
  });

  describe('form control creation and addition', () => {
    it('should add form control to form When `hide` is false', () => {
      field = {
        key: 'title',
        type: 'input',
        hideExpression: 'false',
        validation: {
          show: true,
        },
      };

      builder.buildForm(form, [field], {}, {});
      const control: FormControl = <FormControl> form.get('title');

      expect(field.hide).toBeFalsy();
      expect(field.formControl).not.toBeNull();
      expect(control).not.toBeNull();
    });

    it('should not add form control to form when `hide` is true', () => {
      field = {
        key: 'title',
        type: 'input',
        hideExpression: 'true',
        validation: {
          show: true,
        },
      };

      builder.buildForm(form, [field], {}, {});
      const control: FormControl = <FormControl> form.get('title');

      expect(field.hide).toBeTruthy();
      expect(field.formControl).not.toBeNull();
      expect(control).toBeNull();
    });
  });

  describe('merge field options', () => {
    it('nested property key', () => {
      field = { key: 'nested.title', type: 'input' };
      builder.buildForm(form, [field], { nested: { title: 'test' } }, {});

      expect(field.key).toEqual('nested.title');
      expect(field.wrappers).toEqual(['label']);
      expect(field.model).toEqual({ nested: { title: 'test' } });
    });
    it('nested array key', () => {
      field = { key: 'nested.0.title', type: 'input' };
      builder.buildForm(form, [field], { nested: [{ title: 'test' }] }, {});

      expect(field.key).toEqual('nested.0.title');
      expect(field.model).toEqual({ nested: [{ title: 'test' }] });
    });

    it('should not override wrappers if not empty', () => {
      field = { key: 'nested.title', type: 'input', wrappers: [] };
      builder.buildForm(form, [field], {}, {});

      expect(field.key).toEqual('nested.title');
      expect(field.wrappers).toEqual([]);
    });

    it('should add default wrappers if type is provided', () => {
      field = { type: 'input' };
      builder.buildForm(form, [field], {}, {});

      expect(field.wrappers).toEqual(['label']);
    });
  });

  describe('fieldArray', () => {
    it('should create/build fieldGroup when model is set', () => {
      const fields: FormlyFieldConfig[] = [
        {
          key: 'array',
          type: 'array',
          fieldArray: {
            key: 'test',
            type: 'input',
          },
        },
      ];

      builder.buildForm(form, fields, { array: ['aaa'] }, {});

      expect(fields[0].fieldGroup.length).toEqual(1);
    });
  });
});

@Component({
  selector: 'formly-repeat-section',
  template: '',
})
class RepeatComponent extends FieldArrayType { }
