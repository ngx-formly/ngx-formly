import {
  reverseDeepMerge,
  assignModelValue,
  getFieldId,
  getFieldValue,
  getKeyPath,
  clone,
  wrapProperty,
  assignFieldValue,
} from './utils';
import { FormlyFieldConfig } from './components/formly.field.config';
import { of } from 'rxjs';

describe('FormlyUtils service', () => {
  describe('reverseDeepMerge', () => {
    it('should properly reverse deep merge', () => {
      const foo = { foo: 'bar', obj: {}, arr: [] };
      const bar = {
        foo: 'foo',
        foobar: 'foobar',
        fun: () => console.log('demo'),
        obj: {},
        date: new Date(),
        arr: ['bar'],
      };
      reverseDeepMerge(foo, bar);

      expect(foo['foo']).toEqual('bar');
      expect(foo['foobar']).toEqual('foobar');
      expect(foo['date'] instanceof Date).toBeTruthy();
      expect(foo.arr).toEqual([]);
    });
  });

  describe('assignFieldValue', () => {
    it('should assign field value through the parent', () => {
      const parent: FormlyFieldConfig = { model: {} };
      assignFieldValue({ key: 'foo', parent }, 'test');

      expect(parent.model).toEqual({ foo: 'test' });
    });
  });

  describe('assignModelValue', () => {
    it('should assign model value', () => {
      const model = { name: null };
      assignModelValue(model, ['name'], 'foo');
      expect(model).toEqual({ name: 'foo' });
    });

    it('should assign value with nested path', () => {
      const model = { path: 'test' };
      assignModelValue(model, ['path', 'to', 'save'], 2);
      expect(model['path']['to']['save']).toBe(2);
    });

    it('should assign value with nested array path', () => {
      const model = {};
      assignModelValue(model, ['path', '0'], 'test');
      expect(Array.isArray(model['path'])).toBeTruthy();
      expect(model['path'][0]).toBe('test');
    });

    it('should avoid assigning value by reference', () => {
      const defaultValue = {};
      const model = { array: null };
      assignModelValue(model, ['array'], defaultValue);
      expect(model.array).not.toBe(defaultValue);
    });
  });

  describe('getFieldValue', () => {
    it('should properly get value', () => {
      const model = {
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
      const options: FormlyFieldConfig = { id: '1' };
      const id = getFieldId('formly_1', options, 2);
      expect(id).toBe('1');
    });

    it('should properly get the field id if id is not set in options', () => {
      const options: FormlyFieldConfig = { type: 'input', key: 'email' };
      const id = getFieldId('formly_1', options, 2);
      expect(id).toBe('formly_1_input_email_2');
    });
  });

  describe('getKeyPath', () => {
    it('should get an empty key path for an empty key', () => {
      let keyPath = getKeyPath({});
      expect(keyPath).toEqual([]);
      keyPath = getKeyPath({ key: null });
      expect(keyPath).toEqual([]);
      keyPath = getKeyPath({ key: '' });
      expect(keyPath).toEqual([]);
    });

    it('should get the correct key path of length 1 for a simple string', () => {
      const keyPath = getKeyPath({ key: 'property' });
      expect(keyPath).toEqual(['property']);
    });

    it('should get the correct key path of length 2 for a simple string with an index', () => {
      const keyPath = getKeyPath({ key: 'property[2]' });
      expect(keyPath).toEqual(['property', '2']);
    });

    it('should get the correct key path of length 3 for a simple nested property', () => {
      const keyPath = getKeyPath({ key: 'property1.property2.property3' });
      expect(keyPath).toEqual(['property1', 'property2', 'property3']);
    });

    it('should get the correct key path of length 4 with one index for a nested property containing 1 index property', () => {
      const keyPath = getKeyPath({ key: 'property1.property2[4].property3' });
      expect(keyPath).toEqual(['property1', 'property2', '4', 'property3']);
    });

    it('should attach the key path to the field config', () => {
      const fieldConfig = { key: 'property1.property2[4].property3' };
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
    expect(clone(v)).toBe(v);
  });

  it('FileList', () => {
    const blob = new Blob();
    const file = new File([], 'test');

    expect(clone(blob)).toBe(blob);
    expect(clone(file)).toBe(file);
  });

  it('Date', () => {
    const d = new Date();
    expect(clone(d)).toEqual(d);
    expect(clone(d)).not.toBe(d);
  });

  it('Array', () => {
    const d = [1, 2, 3];
    expect(clone(d)).toEqual(d);
    expect(clone(d)).not.toBe(d);
  });

  it('Object', () => {
    const d = { a: 'test' };
    expect(clone(d)).toEqual(d);
    expect(clone(d)).not.toBe(d);
  });

  it('Map & Set', () => {
    const set = new Set();
    const map = new Map();

    expect(set instanceof Set).toBeTruthy();
    expect(clone(set)).not.toBe(set);

    expect(map instanceof Map).toBeTruthy();
    expect(clone(map)).not.toBe(map);
  });

  it('Object with methods', () => {
    class Foo {
      constructor(public foo = '') {}
      method() {
        return this.foo;
      }
    }
    const foo = new Foo('test');
    const clonedFoo = clone(foo);
    expect(clonedFoo).toEqual(foo);
    expect(clonedFoo).not.toBe(foo);
    // method of the base class have been copied
    expect(clonedFoo.method).toBeTruthy();
    expect(clonedFoo.method()).toEqual(foo.method());
  });
  it('Deep object', () => {
    class Foo {
      constructor(public foo = '') {}
    }
    class Bar {
      constructor(public bar = '', public foo = new Foo(bar)) {}
    }
    const bar = new Bar('test');
    const clonedBar = clone(bar);
    expect(clonedBar).toEqual(bar);
    expect(clonedBar === bar).toBeFalsy();
    // properties of the base class have been deep copied
    expect(clonedBar.foo).toEqual(bar.foo);
    expect(clonedBar.foo === bar.foo).toBeFalsy();
  });

  it('Enumerable getter', () => {
    const d = {};
    Object.defineProperty(d, 'a', { get: () => 'test', enumerable: true });
    const value = clone(d);

    const propDescriptor = Object.getOwnPropertyDescriptor(value, 'a');
    expect(propDescriptor.get).toBeDefined();
    expect(propDescriptor.enumerable).toBeTruthy();
  });

  it('should use bind of the cloned object', () => {
    const d = {};
    Object.defineProperty(d, 'a', {
      get() {
        return this.name;
      },
      enumerable: true,
    });
    const value = clone(d);
    value.name = 'foo';

    expect(value.a).toEqual('foo');
  });
});

describe('wrapProperty', () => {
  it('should observe property change', () => {
    const spy = jest.fn();
    const field = { hide: null };
    wrapProperty(field, 'hide', spy);

    expect(spy).toHaveBeenCalledWith({ currentValue: null, firstChange: true });

    spy.mockReset();
    field.hide = true;
    expect(spy).toHaveBeenCalledWith({ currentValue: true, previousValue: null, firstChange: false });
  });

  it('should allow multi subscribes to property change', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const field = { hide: null };
    wrapProperty(field, 'hide', spy1);
    wrapProperty(field, 'hide', spy2);

    expect(spy1).toHaveBeenCalledWith({ currentValue: null, firstChange: true });
    expect(spy2).toHaveBeenCalledWith({ currentValue: null, firstChange: true });

    spy1.mockReset();
    spy2.mockReset();
    field.hide = true;

    expect(spy1).toHaveBeenCalledWith({ currentValue: true, previousValue: null, firstChange: false });
    expect(spy2).toHaveBeenCalledWith({ currentValue: true, previousValue: null, firstChange: false });
  });

  it('should ignore multi call of the same subscriber', () => {
    const spy = jest.fn();
    const field = { hide: null };
    wrapProperty(field, 'hide', spy);
    wrapProperty(field, 'hide', spy);
    wrapProperty(field, 'hide', spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should be able to unsubscribe', () => {
    const spy = jest.fn();
    const field = { hide: null };
    const observer = wrapProperty(field, 'hide', spy);
    expect(spy).toHaveBeenCalledTimes(1);

    observer();
    spy.mockReset();
    field.hide = true;

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should be able to subscribe the same fn after detroy', () => {
    const spy = jest.fn();
    const field = { hide: null };
    const observer = wrapProperty(field, 'hide', spy);
    expect(spy).toHaveBeenCalledTimes(1);

    observer();
    spy.mockReset();
    field.hide = true;

    expect(spy).toHaveBeenCalledTimes(0);

    wrapProperty(field, 'hide', spy);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
