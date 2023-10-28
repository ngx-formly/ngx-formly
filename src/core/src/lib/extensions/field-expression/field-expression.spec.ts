import { FormControl } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../../models';
import { createBuilder } from '@ngx-formly/core/testing';

function buildField({ model, options, ...field }: FormlyFieldConfigCache): FormlyFieldConfigCache {
  const builder = createBuilder({
    extensions: ['core', 'validation', 'form', 'expression'],
  });

  builder.build({
    model: model || {},
    options,
    fieldGroup: [field],
  });

  return field;
}

describe('FieldExpressionExtension', () => {
  describe('expressions: field visibility', () => {
    it('should evaluate string expression', () => {
      const field = buildField({
        key: 'text',
        expressions: {
          hide: '!model.visibilityToggle',
        },
      });

      expect(field.hide).toBeTrue();
      expect(field.props.hidden).toBeTrue();

      field.model.visibilityToggle = 'test';
      field.options.checkExpressions(field);

      expect(field.hide).toBeFalse();
      expect(field.props.hidden).toBeFalse();
    });

    it('should evaluate function expression', () => {
      const field = buildField({
        key: 'text',
        expressions: { hide: () => true },
      });

      expect(field.hide).toBeTrue();
    });

    it('should evaluate boolean expression', () => {
      const field = buildField({
        key: 'text',
        hideExpression: true,
      });

      expect(field.hide).toBeTrue();
    });

    it('should provide model, formState and field args', () => {
      const spy = jest.fn();
      const field = buildField({
        expressions: { hide: spy },
      });

      expect(spy).toHaveBeenCalledWith(field, expect.any(Boolean));
    });

    describe('attach/detach form control', () => {
      it('should attach form control for displayed field', () => {
        const { formControl } = buildField({ hide: false, key: 'foo' });
        expect(formControl.parent).not.toBeNull();
      });

      it('should detach form control for hidden field', () => {
        const { formControl } = buildField({ hide: true, key: 'foo' });
        expect(formControl.parent).toBeNull();
      });

      it('should toggle form control of child group when key is empty', () => {
        const field = buildField({
          hide: true,
          fieldGroup: [{ fieldGroup: [{ key: 'foo' }] }],
        });
        expect(field.formControl.get('foo')).toBeNull();

        field.hide = false;
        field.options.checkExpressions(field.parent);
        expect(field.formControl.get('foo')).not.toBeNull();
      });

      it('should toggle field control when hide changed programmatically', () => {
        const {
          fieldGroup: fields,
          form,
          options,
        } = buildField({
          fieldGroup: [
            { hide: false, key: 'foo' },
            { hide: true, fieldGroup: [{ key: 'bar' }] },
          ],
        });

        fields[0].hide = true;
        fields[1].hide = false;
        options.checkExpressions({ form, fieldGroup: fields, options });

        expect(form.get('foo')).toBeNull();
        expect(form.get('bar')).not.toBeNull();
      });

      it('should toggle controls of the hidden fields before the visible ones', () => {
        const field = buildField({
          model: { type: false },
          fieldGroup: [
            {
              key: 'key1',
              expressions: { hide: ({ model }) => model.type },
            },
            {
              key: 'key1',
              expressions: { hide: ({ model }) => !model.type },
            },
          ],
        });
        const { options, fieldGroup: fields, form } = field;

        options.checkExpressions(field);
        expect(fields[0].hide).toBeFalse();
        expect(fields[0].formControl).toBe(form.get('key1'));
        expect(fields[1].hide).toBeTrue();
        expect(fields[1].formControl).toBe(form.get('key1'));
      });

      it('should take account of parent hide state', () => {
        const child: FormlyFieldConfig = {
          key: 'child',
          defaultValue: 'foo',
          expressions: { hide: () => false },
        };
        buildField({
          fieldGroup: [
            {
              key: 'parent',
              hide: true,
              fieldGroup: [{ fieldGroup: [child] }],
            },
          ],
        });

        expect(child.hide).toBeTruthy();
      });

      it('should support multiple field with the same key', () => {
        const field = buildField({
          fieldGroup: [
            {
              key: 'key1',
              formControl: new FormControl(),
              expressions: { hide: ({ model }) => model.type },
            },
            {
              key: 'key1',
              formControl: new FormControl(),
              expressions: { hide: ({ model }) => !model.type },
            },
          ],
        });

        const {
          form,
          fieldGroup: [f1, f2],
        } = field;

        field.model.type = false;
        field.options.checkExpressions(field.parent);

        expect(f1.hide).toBeFalse();
        expect(f1.formControl).toBe(form.get('key1'));
        expect(f2.hide).toBeTrue();
        expect(f2.formControl).not.toBe(form.get('key1'));

        field.model.type = true;
        field.options.checkExpressions(field.parent);
        expect(f1.hide).toBeTrue();
        expect(f1.formControl).not.toBe(form.get('key1'));
        expect(f2.hide).toBeFalse();
        expect(f2.formControl).toBe(form.get('key1'));
      });
    });

    it('should not override hide field within fieldGroup', () => {
      const field = buildField({
        expressions: { hide: () => false },
        fieldGroup: [
          {
            key: 'test',
            hide: true,
          },
        ],
      });

      expect(field.hide).toBeFalse();
      expect(field.fieldGroup[0].hide).toBeTrue();
    });

    it('should ignore validation of hidden fields (same key)', () => {
      const field = buildField({
        fieldGroup: [{ key: 'name', hide: true, props: { required: true } }, { key: 'name' }],
      });

      field.fieldGroup[0].hide = false;

      field.options.checkExpressions(field);
      expect(field.form.valid).toBeFalse();
    });
  });

  describe('expressions', () => {
    it('should resolve a string expression', () => {
      const field = buildField({
        key: 'name',
        model: { label: 'test' },
        options: { formState: { className: 'name_test' } },
        expressions: {
          // using formState
          className: 'formState.className',
          // using field
          'props.key': 'field.key',
          // using model
          'props.label': 'model.label',
        },
      });

      expect(field.className).toEqual('name_test');
      expect(field.props.key).toEqual('name');
      expect(field.props.label).toEqual('test');
    });

    it('should provide model, formState and field args', () => {
      const spy = jest.fn();
      const field = buildField({
        expressions: {
          className: spy,
        },
      });

      expect(spy).toHaveBeenCalledWith(field, expect.any(Boolean));
    });

    it('should resolve a function expression', () => {
      const field = buildField({
        model: { label: 'test' },
        expressions: {
          'props.label': () => 'test',
        },
      });

      expect(field.props.label).toEqual('test');
    });

    it('should resolve an observable expression', () => {
      const field = buildField({
        expressions: {
          'props.label': of('test'),
        },
      });

      const subscription = field._expressions['props.label'].value$.subscribe();
      expect(field.props.label).toEqual('test');
      subscription.unsubscribe();
    });

    describe('model expression', () => {
      it('should resolve a model expression (field key = model key)', () => {
        const field = buildField({
          model: { label: 'test' },
          options: { formState: { className: 'name_test' } },
          key: 'name',
          expressions: {
            'model.name': () => 'name_test',
          },
        });

        expect(field.formControl.value).toEqual('name_test');
        expect(field.model.name).toEqual('name_test');
      });

      it('should resolve a model expression (field key != model key)', () => {
        const field = buildField({
          model: { label: 'test' },
          fieldGroup: [
            {
              key: 'name',
              expressions: {
                'model.custom': () => 'custom_test',
              },
            },
            { key: 'custom' },
          ],
        });

        expect(field.model.custom).toEqual('custom_test');
      });

      it('should resolve a model expression (nested field key)', () => {
        const field = buildField({
          model: { address: {} },
          expressions: {
            'model.address.city': () => 'custom_test',
          },
          fieldGroup: [{ key: 'address', fieldGroup: [{ key: 'city' }] }],
        });

        expect(field.formControl.value).toEqual({ address: { city: 'custom_test' } });
        expect(field.model).toEqual({ address: { city: 'custom_test' } });
      });
    });

    it('should update field validity when using built-in validations expression', () => {
      const formControl = new FormControl();
      jest.spyOn(formControl, 'updateValueAndValidity');

      buildField({
        key: 'checked',
        formControl,
        expressions: {
          'props.required': 'model.checked',
        },
        model: { checked: true },
      });

      expect(formControl.updateValueAndValidity).toHaveBeenCalledTimes(3);
    });

    describe('field disabled state', () => {
      it('should update field disabled state', () => {
        const field = buildField({
          key: 'text',
          expressions: {
            'props.disabled': 'model.disableToggle',
          },
        });

        expect(field.props.disabled).toBeFalse();

        field.model.disableToggle = 'test';
        field.options.checkExpressions(field);

        expect(field.props.disabled).toBeTrue();
      });

      it('should take account of parent disabled state', () => {
        const disabled = {
          address: true,
          city: false,
        };
        const field = buildField({
          key: 'address',
          expressions: { 'props.disabled': () => disabled.address },
          fieldGroup: [
            {
              key: 'city',
              expressions: { 'props.disabled': () => disabled.city },
            },
            {
              key: 'street',
              expressions: { 'props.label': () => 'Street' },
            },
          ],
        });

        expect(field.props.disabled).toBeTrue();
        expect(field.fieldGroup[0].props.disabled).toBeTrue();
        expect(field.fieldGroup[1].props.label).toEqual('Street');

        disabled.address = false;
        field.options.checkExpressions(field);

        expect(field.props.disabled).toBeFalse();
        expect(field.fieldGroup[0].props.disabled).toBeFalse();

        disabled.city = true;
        field.options.checkExpressions(field);

        expect(field.props.disabled).toBeFalse();
        expect(field.fieldGroup[0].props.disabled).toBeTrue();
      });

      it('should update disabled state of hidden fields', () => {
        const field = buildField({
          key: 'group',
          model: { group: { disableToggle: false } },
          expressions: {
            'props.disabled': 'model.disableToggle',
          },
          fieldGroup: [{ key: 'child', hide: true }],
        });

        expect(field.props.disabled).toBeFalse();
        expect(field.fieldGroup[0].props.disabled).toBeFalse();

        field.model.disableToggle = true;
        field.options.checkExpressions(field.parent);

        expect(field.props.disabled).toBeTrue();
        expect(field.fieldGroup[0].props.disabled).toBeTrue();
      });

      it('should change model through observable', () => {
        const field = buildField({
          key: 'text',
          expressions: {
            'model.text': of('test'),
          },
        });

        const subscription = field._expressions['model.text'].value$.subscribe();
        expect(field.formControl.value).toEqual('test');
        subscription.unsubscribe();
      });

      it('should throw error when assign to an undefined prop', () => {
        const build = () =>
          buildField({
            key: 'text',
            expressions: {
              'nested.prop': '"ddd"',
            },
          });

        expect(build).toThrowError(
          /\[Formly Error\] \[Expression "nested.prop"\] (Cannot set property 'prop' of undefined|Cannot set properties of undefined \(setting 'prop'\))/i,
        );
      });
    });

    describe('model changes', () => {
      it('should emit formControl value changes', () => {
        const {
          fieldGroup: fields,
          options,
          model,
        } = buildField({
          fieldGroup: [
            {
              key: 'text',
              type: 'input',
              expressions: {
                'model.text2': 'model.text',
              },
            },
            {
              key: 'text2',
              type: 'input',
            },
          ],
        });

        expect(fields[1].formControl.value).toBeUndefined();
        const spy = jest.fn();
        fields[1].formControl.valueChanges.subscribe(spy);
        expect(spy).not.toHaveBeenCalled();

        model.text = 'test';
        options.build();

        expect(spy).toHaveBeenCalledWith('test');
      });

      it('should supports array notation in expression property', () => {
        const field = buildField({
          model: [],
          props: {
            options: [
              { label: 'bar', value: 'bar' },
              { label: 'baz', value: 'baz' },
            ],
          },
          expressions: {
            'model[0]': '1',
            'model["1"]': '2',
            "model['2']": '3',
            "props['prop1']": '1',
            'props["prop.2"]': '2',
            'props.options[1].label': '"123"',
          },
        });

        expect(field.model).toEqual([1, 2, 3]);
      });

      it('should supports nested model assign in expression property', () => {
        const field = buildField({
          fieldGroup: [
            {
              key: 'group1',
              fieldGroup: [
                {
                  key: 'child1',
                  expressions: { 'model.child2': '2' },
                },
              ],
              expressions: { 'model.child1': '1' },
            },
          ],
          expressions: { 'model.group2.child1': '1' },
        });

        expect(field.model).toEqual({
          group1: { child1: 1, child2: 2 },
          group2: { child1: 1 },
        });
      });

      it('should avoid extra expressions calls', () => {
        const spy = jest.fn();
        const field = buildField({
          key: 'text',
          _componentRefs: [],
          expressions: { hide: spy },
        });

        // 2 calls during the build step
        expect(spy).toHaveBeenCalledTimes(2);

        // 2 calls for resetModel
        spy.mockReset();
        field.options.resetModel({ test: '123' });
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    it('should check expression when detecting new field changes', () => {
      const { fieldGroup: fields } = buildField({
        fieldGroup: [
          {
            key: 'checkbox1',
            type: 'checkbox',
            defaultValue: true,
            resetOnHide: true,
          },
          {
            key: 'checkbox2',
            type: 'checkbox',
            defaultValue: true,
            expressions: { hide: '!model.checkbox1' },
            resetOnHide: true,
          },
          {
            key: 'checkbox3',
            type: 'checkbox',
            defaultValue: true,
            expressions: { hide: '!model.checkbox1 || !model.checkbox2' },
            resetOnHide: true,
          },
        ],
      });

      expect(fields[1].hide).toEqual(false);
      expect(fields[2].hide).toEqual(false);
    });

    it('should detect assign an object and function in expression', () => {
      const field = buildField({
        model: { assign: false },
        expressions: {
          'model.object': ({ model }) => (model.assign ? { test: 'foo' } : undefined),
          'model.function': ({ model }) => (model.assign ? () => 'test' : undefined),
        },
      });

      field.model.assign = true;
      field.options.checkExpressions(field);

      expect(field.model['object']).toEqual({ test: 'foo' });
      expect(typeof field.model['function']).toEqual('function');
    });
  });

  describe('fieldChanges', () => {
    it('should emit fieldChanges on change field visibility', () => {
      const fieldChanges = new Subject<any>();
      const spy = jest.fn();
      const subscription = fieldChanges.subscribe(spy);

      const field = buildField({
        key: 'text',
        expressions: { hide: '!model.visibilityToggle' },
        options: { fieldChanges },
      });

      expect(spy).toHaveBeenNthCalledWith(1, { field, type: 'expressionChanges', property: 'hide', value: true });
      expect(spy).toHaveBeenNthCalledWith(2, { field, type: 'hidden', value: true });

      spy.mockReset();
      field.model.visibilityToggle = 'test';
      field.options.checkExpressions(field.parent);

      expect(spy).toHaveBeenNthCalledWith(1, { field, type: 'expressionChanges', property: 'hide', value: false });
      expect(spy).toHaveBeenNthCalledWith(2, { field, type: 'hidden', value: false });

      subscription.unsubscribe();
    });

    it('should emit fieldChanges when expression value changes', () => {
      const fieldChanges = new Subject<any>();
      const spy = jest.fn();
      const subscription = fieldChanges.subscribe(spy);

      const field = buildField({
        key: 'text',
        options: { fieldChanges },
        expressions: {
          'props.label': 'field.formControl.value',
        },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        field,
        type: 'expressionChanges',
        property: 'props.label',
        value: undefined,
      });

      spy.mockReset();
      field.formControl.patchValue('foo');
      field.options.checkExpressions(field.parent);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        field,
        type: 'expressionChanges',
        property: 'props.label',
        value: 'foo',
      });

      subscription.unsubscribe();
    });
  });
});
