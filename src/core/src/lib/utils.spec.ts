import { reverseDeepMerge, assignModelValue, getFieldId, getFieldValue, getKeyPath, clone } from './utils';
import { FormlyFieldConfig } from './components/formly.field.config';
import { of } from 'rxjs';

describe('FormlyUtils service', () => {
  describe('reverseDeepMerge', () => {
    it('should properly reverse deep merge', () => {
      let foo = {foo: 'bar', obj: {}, arr: [] };
      let bar = { foo: 'foo', foobar: 'foobar', fun: () => console.log('demo'), obj: {}, date: new Date(), arr: ['bar']};
      reverseDeepMerge(foo, bar);

      expect(foo['foo']).toEqual('bar');
      expect(foo['foobar']).toEqual('foobar');
      expect(foo['date'] instanceof Date).toBeTruthy();
      expect(foo.arr).toEqual([]);
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

  describe('getFieldValue', () => {
    it('should properly get value', () => {
      let model = {
        value: 2,
        'looks.nested': 'foo',
        nested: {
          value: 'bar',
        },
      };

      expect(getFieldValue({ parent: { model }, key: 'path.to.save' })).toBe(undefined);
      expect(getFieldValue({ parent: { model }, key: 'value' })).toBe(2);
      expect(getFieldValue({ parent: { model }, key: 'looks.nested' })).toBe(undefined);
      expect(getFieldValue({ parent: { model }, key: 'nested.value' })).toBe('bar');
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
      expect(keyPath).toEqual(['property', '2']);
    });

    it('should get the correct key path of length 3 for a simple nested property', () => {
      let keyPath = getKeyPath({key: 'property1.property2.property3'});
      expect(keyPath).toEqual(['property1', 'property2', 'property3']);
    });

    it('should get the correct key path of length 4 with one index for a nested property containing 1 index property',  () => {
      let keyPath = getKeyPath({key: 'property1.property2[4].property3'});
      expect(keyPath).toEqual(['property1', 'property2', '4', 'property3']);
    });

    it('should attach the key path to the field config', () => {
      let fieldConfig = {key: 'property1.property2[4].property3'};
      getKeyPath(fieldConfig);
      expect(fieldConfig['_keyPath'].path).toEqual(['property1', 'property2', '4', 'property3']);
    });

    it('should refresh formlyKeyPath on key updated', () => {
      const fieldConfig = { key: 'property1.property2[4].property3' };
      expect(getKeyPath(fieldConfig)).toEqual(['property1', 'property2', '4', 'property3']);

      fieldConfig.key = 'ddd';
      expect(getKeyPath(fieldConfig)).toEqual(['ddd']);
    });

  });
});

describe('clone', () => {
  it('RegExp', () => {
    expect(clone(/[^0-9]+/g)).toEqual(/[^0-9]+/g);
  });

  it('Observable', () => {
    const v = of(['clone']);
    expect(clone(v)).toEqual(v);
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
