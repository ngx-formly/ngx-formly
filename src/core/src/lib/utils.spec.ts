import {
  reverseDeepMerge,
  assignModelValue,
  getFieldId,
  getFieldValue,
  getKeyPath,
  clone,
  observe,
  assignFieldValue,
  defineHiddenProp,
  observeDeep,
  getField,
} from './utils';
import { FormlyFieldConfig } from './models';
import { of } from 'rxjs';
import { FormlyField } from './core';

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
      expect(foo['date'] instanceof Date).toBeTrue();
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
      expect(Array.isArray(model['path'])).toBeTrue();
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

    it('should take account passing a non-string for type', () => {
      const customType = FormlyField;
      let options: FormlyFieldConfig = { type: customType as any };
      let id = getFieldId('formly_1', options, 2);
      expect(id).toBe('formly_1_FormlyField__2');
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
      keyPath = getKeyPath({ key: 0 });
      expect(keyPath).toEqual(['0']);
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

  it('Uint8Array', () => {
    const array = new Uint8Array();
    expect(clone(array)).not.toBe(array);
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
    expect(clonedFoo.method).toBeFunction();
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
    expect(clonedBar === bar).toBeFalse();
    // properties of the base class have been deep copied
    expect(clonedBar.foo).toEqual(bar.foo);
    expect(clonedBar.foo === bar.foo).toBeFalse();
  });

  it('Enumerable getter', () => {
    const d = {};
    Object.defineProperty(d, 'a', { get: () => 'test', enumerable: true });
    const value = clone(d);

    const propDescriptor = Object.getOwnPropertyDescriptor(value, 'a');
    expect(propDescriptor.get).toBeDefined();
    expect(propDescriptor.enumerable).toBeTrue();
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

describe('observeDeep', () => {
  it('should not emit first change on observe', () => {
    const spy = jest.fn();
    observeDeep({ foo: 'test' }, ['foo'], spy);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should observe a scalar value', () => {
    const spy = jest.fn();
    const o = { foo: 'test' };
    observeDeep(o, ['foo'], spy);
    o.foo = 'bar';

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should observe an object', () => {
    const spy = jest.fn();
    const o = { address: { city: 'foo' } };
    observeDeep(o, ['address'], spy);
    const prevAddress = o.address;
    o.address = { city: 'foo' };
    o.address.city = 'bar';

    expect(spy).toHaveBeenCalledTimes(2);

    // check if unsubscribed from the old object
    spy.mockReset();
    prevAddress.city = 'bar';
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should observe a nested object', () => {
    const spy = jest.fn();
    const o = { foo: { bar: undefined } };
    observeDeep(o, ['foo'], spy);
    o.foo = { bar: 'test' };

    expect(o.foo).toEqual({ bar: 'test' });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should be able to unsubscribe', () => {
    const spy = jest.fn();
    const o = { address: { city: 'foo' } };
    const unsubscribe = observeDeep(o, ['address'], spy);
    o.address.city = 'bar';
    expect(spy).toHaveBeenCalledTimes(1);

    unsubscribe();
    spy.mockReset();
    o.address.city = 'test';

    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe('observe', () => {
  it('should emit first change on observe', () => {
    const spy = jest.fn();
    observe({ foo: 'test' }, ['foo'], spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      currentValue: 'test',
      firstChange: true,
    });
  });

  it('should observe and emit prop changes', () => {
    const spy = jest.fn();
    const o = { foo: 'test' };
    observe(o, ['foo'], spy);
    spy.mockReset();

    o.foo = 'bar';

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      previousValue: 'test',
      currentValue: 'bar',
      firstChange: false,
    });
  });

  it('should observe a nested prop', () => {
    const spy = jest.fn();
    const o = { group: { foo: 'test' } };
    observe(o, ['group', 'foo'], spy);
    spy.mockReset();

    o.group.foo = 'bar';

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      previousValue: 'test',
      currentValue: 'bar',
      firstChange: false,
    });
  });

  it('should init and observe an undefined nested prop', () => {
    const spy = jest.fn();
    const o: any = {};
    observe(o, ['group', 'foo'], spy);
    spy.mockReset();

    o.group.foo = 'bar';

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      previousValue: undefined,
      currentValue: 'bar',
      firstChange: false,
    });
  });

  it('should allow multi observe of the same property', () => {
    const o = { foo: 'test' };

    const spy1 = jest.fn();
    observe(o, ['foo'], spy1);
    spy1.mockReset();

    const spy2 = jest.fn();
    observe(o, ['foo'], spy2);
    spy2.mockReset();

    o.foo = 'bar';

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('should be able to update prop value without emitting a change event', () => {
    const spy = jest.fn();
    const o = { foo: 'test' };
    const observer = observe(o, ['foo'], spy);
    spy.mockReset();

    observer.setValue('bar');

    expect(o.foo).toEqual('bar');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not allow subscribe duplication', () => {
    const spy = jest.fn();
    const field = { hide: null };
    observe(field, ['hide'], spy);
    observe(field, ['hide'], spy);
    observe(field, ['hide'], spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should be able to unsubscribe', () => {
    const spy = jest.fn();
    const field = { hide: null };
    const observer = observe(field, ['hide'], spy);
    expect(spy).toHaveBeenCalledTimes(1);

    observer.unsubscribe();
    spy.mockReset();
    field.hide = true;

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should be able to subscribe the same fn after detroy', () => {
    const spy = jest.fn();
    const field = { hide: null };
    const observer = observe(field, ['hide'], spy);
    expect(spy).toHaveBeenCalledTimes(1);

    observer.unsubscribe();
    spy.mockReset();
    field.hide = true;

    expect(spy).toHaveBeenCalledTimes(0);

    observe(field, ['hide'], spy);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not change the enumerable descriptor', () => {
    const field = { foo: true };
    observe(field, ['foo'], () => {});
    expect(Object.getOwnPropertyDescriptor(field, 'foo').enumerable).toEqual(true);

    defineHiddenProp(field, 'bar', true);
    observe(field, ['bar'], () => {});
    expect(Object.getOwnPropertyDescriptor(field, 'bar').enumerable).toEqual(false);
  });
});

describe('getField', () => {
  it('should find child', () => {
    const field = { fieldGroup: [{ key: 'child1' }] };
    const childField = getField(field, 'child1');

    expect(childField.key).toEqual('child1');
  });

  it('should find the nested child', () => {
    const field = {
      fieldGroup: [
        {
          key: 'parent',
          fieldGroup: [{ key: 'child1' }],
        },
      ],
    };

    const childField = getField(field, 'parent.child1');
    expect(childField.key).toEqual('child1');
  });

  it('find using array key', () => {
    const field = {
      fieldGroup: [
        {
          key: 'parent',
          fieldGroup: [{ key: 'child1' }],
        },
      ],
    };

    const childField = getField(field, ['parent', 'child1']);
    expect(childField.key).toEqual('child1');
  });

  it('should return undefined when field does not exist', () => {
    expect(getField({}, ['parent', 'child1'])).toBeUndefined();
  });
});
