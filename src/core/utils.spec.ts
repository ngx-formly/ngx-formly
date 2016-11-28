import { reverseDeepMerge, assignModelValue, getFieldId, getValueForKey, getKey, evalExpression } from './utils';
import { FormlyFieldConfig } from './components/formly.field.config';

describe('FormlyUtils service', () => {
  describe('reverseDeepMerge', () => {
    it('should properly reverse deep merge', () => {
      let foo = {foo: 'bar', obj: {}};
      let bar = {foo: 'foo', foobar: 'foobar', fun: () => console.log('demo'), obj: {}};
      reverseDeepMerge(foo, bar);

      expect(foo['foo']).toEqual('bar');
      expect(foo['foobar']).toEqual('foobar');
    });
  });

  describe('assignModelValue', () => {
    it('should properly assign model value', () => {
      let model = {};
      assignModelValue(model, 'path.to.save', 2);
      expect(model['path']['to']['save']).toBe(2);
    });
  });

  describe('getValueForKey', () => {
    it('should properly get value', () => {
      let model = {
        value: 2,
      };
      expect(getValueForKey(model, 'path.to.save')).toBe(undefined);
      expect(getValueForKey(model, 'value')).toBe(2);
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
