import { reverseDeepMerge, assignModelValue, getFieldId, getValueForKey, getKey, evalExpression, getKeyPath, getFieldModel, clone, assignModelToFields } from './utils';
import { FormlyFieldConfig } from './components/formly.field.config';

describe('FormlyUtils service', () => {
  describe('reverseDeepMerge', () => {
    it('should properly reverse deep merge', () => {
      let foo = {foo: 'bar', obj: {}};
      let bar = {foo: 'foo', foobar: 'foobar', fun: () => console.log('demo'), obj: {}, date: new Date()};
      reverseDeepMerge(foo, bar);

      expect(foo['foo']).toEqual('bar');
      expect(foo['foobar']).toEqual('foobar');
      expect(foo['date'] instanceof Date).toBeTruthy();
    });
  });

  describe('assignModelValue', () => {
    it('should properly assign model value', () => {
      let model = {};
      assignModelValue(model, 'path.to.save', 2);
      expect(model['path']['to']['save']).toBe(2);
    });
    it('should properly assign object to string value', () => {
      let model = { path: 'test' };
      assignModelValue(model, 'path.to.save', 2);
      expect(model['path']['to']['save']).toBe(2);
    });
  });

  describe('getValueForKey', () => {
    it('should properly get value', () => {
      let model = {
        value: 2,
        'looks.nested': 'foo',
        nested: {
          value: 'bar',
        },
      };
      expect(getValueForKey(model, 'path.to.save')).toBe(undefined);
      expect(getValueForKey(model, 'value')).toBe(2);
      expect(getValueForKey(model, 'looks.nested')).toBe(undefined);
      expect(getValueForKey(model, 'nested.value')).toBe('bar');
    });
  });

  describe('getKey', () => {
    it('should properly get key', () => {
      expect(getKey('key', 'path.to.save')).toBe('path.to.save.key');
      expect(getKey('key', undefined)).toBe('key');
    });
  });

  describe('getFieldId', () => {
    it('should properly get the field id if id is set in options', () => {
      let options: FormlyFieldConfig = {id: '1'};
      let id = getFieldId('formly_1', options, 2);
      expect(id).toBe('1');
    });

    it('should properly get the field id if id is not set in options', () => {
      let options: FormlyFieldConfig = {type: 'input', key: 'email'};
      let id = getFieldId('formly_1', options, 2);
      expect(id).toBe('formly_1_input_email_2');
    });
  });

  describe('getKeyPath', () => {

    it('should get an empty key path for an empty key', () => {
      let keyPath = getKeyPath({});
      expect(keyPath).toEqual([]);
      keyPath = getKeyPath({key: null});
      expect(keyPath).toEqual([]);
      keyPath = getKeyPath({key: ''});
      expect(keyPath).toEqual([]);
    });

    it('should get the correct key path of length 1 for a simple string', () => {
      let keyPath = getKeyPath({key: 'property'});
      expect(keyPath).toEqual(['property']);
    });

    it('should get the correct key path of length 2 for a simple string with an index', () => {
      let keyPath = getKeyPath({key: 'property[2]'});
      expect(keyPath).toEqual(['property', 2]);
    });

    it('should get the correct key path of length 3 for a simple nested property', () => {
      let keyPath = getKeyPath({key: 'property1.property2.property3'});
      expect(keyPath).toEqual(['property1', 'property2', 'property3']);
    });

    it('should get the correct key path of length 4 with one index for a nested property containing 1 index property',  () => {
      let keyPath = getKeyPath({key: 'property1.property2[4].property3'});
      expect(keyPath).toEqual(['property1', 'property2', 4, 'property3']);
    });

    it('should get the correct key path of length 5 with one index for a complex array key', () => {
      let keyPath = getKeyPath({key: ['property1.property2[4].property3', 'property4']});
      expect(keyPath).toEqual(['property1', 'property2', 4, 'property3', 'property4']);
    });

    it('should get the correct key path if the path contains a numeric path element',  () => {
      let keyPath = getKeyPath({key: ['property1.2.property2']});
      expect(keyPath).toEqual(['property1', 2, 'property2']);
    });

    it('should attach the key path to the field config', () => {
      let fieldConfig = {key: 'property1.property2[4].property3'};
      getKeyPath(fieldConfig);
      expect(fieldConfig['_formlyKeyPath'].path).toEqual(['property1', 'property2', 4, 'property3']);
    });

    it('should refresh formlyKeyPath on key updated', () => {
      const fieldConfig = { key: 'property1.property2[4].property3' };
      expect(getKeyPath(fieldConfig)).toEqual(['property1', 'property2', 4, 'property3']);

      fieldConfig.key = 'ddd';
      expect(getKeyPath(fieldConfig)).toEqual(['ddd']);
    });

  });

});


describe ('getFieldModel', () => {

  it('should extract te correct simple property', () => {

    let config: FormlyFieldConfig = {key: 'property1'};
    let model: any = {property1: 3};
    let fieldModel: any = getFieldModel(model, config, true);
    expect(fieldModel).toEqual(3);

  });


  it('should extract te correct nested property', () => {

    let config: FormlyFieldConfig = {key: 'property1.property2[2]'};
    let model:  any = {property1: {property2: [1, 1, 2]}};
    let fieldModel: any = getFieldModel(model, config, true);
    expect(fieldModel).toEqual(2);

    config = {key: 'property1.property2[2].property3'};
    model = {property1: {property2: [1, 1, {property3: 'test'}]}};
    fieldModel = getFieldModel(model, config, true);
    expect(fieldModel).toEqual('test');

    config = {key: 'property1.property2.property3'};
    model = {property1: {property2: {property3: 'test'}}};
    fieldModel = getFieldModel(model, config, true);
    expect(fieldModel).toEqual('test');


  });

  it('should create the necessary empty objects in a simple property path', () => {

    let config: FormlyFieldConfig = {key: 'property1'};
    let model: any = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({});

    config = {key: 'property1', fieldGroup: []};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {}});

    config = {key: 'property1', fieldArray: {}};
    model  = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: []});

  });

  it('should create the necessary empty objects in a nested property path', () => {

    let config: FormlyFieldConfig = {key: 'property1.property2'};
    let model: any  = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {}});

    config = {key: 'property1.property2', fieldGroup: []};
    model  = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: {}}});

    config = {key: 'property1.property2', fieldArray: {}};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: []}});

    config = {key: 'property1.property2.property3'};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: {}}});

    config = {key: 'property1.property2.property3', fieldGroup: []};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: {property3: {}}}});

    config = {key: 'property1.property2.property3', fieldArray: {}};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: {property3: []}}});

    config  = {key: 'property1.property2[2]'};
    model  = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: []}});

    config = {key: 'property1.property2[2]', fieldGroup: []};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: [undefined, undefined, {}]}});

    config = {key: 'property1.property2[2]', fieldArray: {}};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: [undefined, undefined, []]}});

    config = {key: 'property1.property2[2].property3', fieldGroup: []};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: [undefined, undefined, {property3: {}}]}});

    config = {key: 'property1.property2[2].property3', fieldArray: {}};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: [undefined, undefined, {property3: []}]}});

    config = {key: 'property1.property2[2].property3'};
    model = {};
    getFieldModel(model, config, true);
    expect(model).toEqual({property1: {property2: [undefined, undefined, {}]}});

  });

  describe('evalExpression', () => {
    it('should evaluate the value correctly', () => {
      let expression = () => { return this.model.val; };
      this.model = {
        val: 2,
      };
      expect(evalExpression(expression, this, [this.model])).toBe(2);
    });
  });
});

describe('assignModelToFields', () => {
  let fields: FormlyFieldConfig[],
    model: any;

  it('with simple field', () => {
    model = { city: 'foo' };
    fields = [{ key: 'city' }];

    assignModelToFields(fields, model);

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

      assignModelToFields(fields, model);

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

      assignModelToFields(fields, model);

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

      assignModelToFields(fields, model);

      expect(fields[0].model).toEqual(model.location.address);
      expect(fields[0].fieldGroup[0].model).toEqual(model.location.address);
    });
  });
});

describe('clone', () => {
  it('RegExp', () => {
    expect(clone(/[^0-9]+/g)).toEqual(/[^0-9]+/g);
  });

  it('Date', () => {
    const d = new Date();
    expect(clone(d)).toEqual(d);
    expect(clone(d) === d).toBeFalsy();
  });

  it('Array', () => {
    const d = [1, 2, 3];
    expect(clone(d)).toEqual(d);
    expect(clone(d) === d).toBeFalsy();
  });

  it('Object', () => {
    const d = { a: 'test' };
    expect(clone(d)).toEqual(d);
    expect(clone(d) === d).toBeFalsy();
  });
});
