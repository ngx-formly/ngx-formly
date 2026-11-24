import { FormlyValueChangeEvent } from '@ngx-formly/core';
import { MockInstance } from 'vitest';
import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { createBuilder, createFieldComponent, FormlyInputModule } from '@ngx-formly/core/testing';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../../models';

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
  describe('signal expressions', () => {
    const flush = (detectChanges: () => void) => {
      TestBed.tick();
      detectChanges();
    };

    it('should apply the value during the build', () => {
      const field = buildField({ key: 'city', expressions: { 'props.label': signal('City') } });

      expect(field.props.label).toBe('City');
    });

    it('should update the field when the signal changes without a model change', () => {
      const locked = signal(true);
      const { field, query, detectChanges } = createFieldComponent(
        { key: 'city', type: 'input', expressions: { 'props.disabled': locked } },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);
      expect(query<HTMLInputElement>('input').nativeElement.disabled).toBe(true);

      locked.set(false);
      flush(detectChanges);

      expect(field.props.disabled).toBe(false);
      expect(query<HTMLInputElement>('input').nativeElement.disabled).toBe(false);
    });

    it('should recompute a computed expression only when its source changes', () => {
      const locked = signal(false);
      const compute = vi.fn(() => locked());
      const { field, detectChanges } = createFieldComponent(
        {
          fieldGroup: [
            { key: 'name', type: 'input' },
            { key: 'city', type: 'input', expressions: { 'props.disabled': computed(compute) } },
          ],
        },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);
      const [name, city] = field.fieldGroup;
      compute.mockClear();

      name.formControl.setValue('Ada');
      flush(detectChanges);
      expect(compute).not.toHaveBeenCalled();

      locked.set(true);
      flush(detectChanges);
      expect(compute).toHaveBeenCalledTimes(1);
      expect(city.props.disabled).toBe(true);
    });

    it('should keep the model value of a field hidden from the start and show it later', () => {
      const hidden = signal(true);
      const { field, query, detectChanges } = createFieldComponent(
        { key: 'city', type: 'input', model: { city: 'Rome' }, expressions: { hide: hidden } },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);

      expect(query('input')).toBeNull();
      expect(field.form.get('city')).toBeNull();
      expect(field.model.city).toBe('Rome');

      hidden.set(false);
      flush(detectChanges);

      expect(query('input')).not.toBeNull();
      expect(field.form.get('city')).not.toBeNull();
    });

    it('should follow the new signal and release the old one when the expression is replaced', () => {
      const source = signal('First');
      const compute = vi.fn(() => source());
      const replacement = signal('Second');
      const { field, detectChanges } = createFieldComponent(
        { key: 'city', type: 'input', expressions: { 'props.label': computed(compute) } },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);

      field.expressions['props.label'] = replacement;
      flush(detectChanges);
      expect(field.props.label).toBe('Second');

      compute.mockClear();
      source.set('Ignored');
      flush(detectChanges);
      expect(compute).not.toHaveBeenCalled();

      replacement.set('Updated');
      flush(detectChanges);
      expect(field.props.label).toBe('Updated');
    });

    it('should not follow signals read by other expressions of the field', () => {
      const other = signal('Before');
      const { field, detectChanges } = createFieldComponent(
        {
          key: 'city',
          type: 'input',
          expressions: { 'props.label': signal('City'), 'props.description': () => other() },
        },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);

      other.set('After');
      flush(detectChanges);

      expect(field.props.description).toBe('Before');
    });

    it('should remove the control and clear the value when the hide signal changes', () => {
      const hidden = signal(false);
      const { field, query, detectChanges } = createFieldComponent(
        { key: 'city', type: 'input', model: { city: 'Rome' }, expressions: { hide: hidden } },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);
      expect(query('input')).not.toBeNull();
      expect(field.form.get('city')).not.toBeNull();

      hidden.set(true);
      flush(detectChanges);
      expect(query('input')).toBeNull();
      expect(field.form.get('city')).toBeNull();
      expect(field.model.city).toBeUndefined();

      hidden.set(false);
      flush(detectChanges);
      expect(query('input')).not.toBeNull();
      expect(field.form.get('city')).not.toBeNull();
    });

    it('should emit the initial value only once', () => {
      const fieldChanges = new Subject<FormlyValueChangeEvent>();
      const spy = vi.fn();
      const subscription = fieldChanges.subscribe(spy);
      const { detectChanges } = createFieldComponent(
        { key: 'city', type: 'input', options: { fieldChanges }, expressions: { 'props.label': signal('City') } },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);

      expect(spy.mock.calls.filter(([event]) => event.type === 'expressionChanges')).toHaveLength(1);

      subscription.unsubscribe();
    });

    it('should not emit expressionChanges on rebuild when the signal value is unchanged', () => {
      const fieldChanges = new Subject<any>();
      const spy = vi.fn();
      const subscription = fieldChanges.subscribe(spy);
      const label = signal('City');
      const field = buildField({
        key: 'city',
        options: { fieldChanges },
        expressions: { 'props.label': label },
      });
      const expressionEvents = () => spy.mock.calls.filter(([event]) => event.type === 'expressionChanges');
      expect(expressionEvents()).toHaveLength(1);

      spy.mockReset();
      field.options.checkExpressions(field.parent, true);
      expect(expressionEvents()).toHaveLength(0);
      expect(field.props.label).toBe('City');

      label.set('Town');
      field.options.checkExpressions(field.parent, true);
      expect(expressionEvents()).toHaveLength(1);
      expect(field.props.label).toBe('Town');

      subscription.unsubscribe();
    });

    it('should keep a child disabled while its parent is disabled', () => {
      const locked = signal(true);
      const { field, detectChanges } = createFieldComponent(
        {
          key: 'group',
          expressions: { 'props.disabled': () => true },
          fieldGroup: [{ key: 'city', type: 'input', expressions: { 'props.disabled': locked } }],
        },
        { imports: [FormlyInputModule] },
      );
      flush(detectChanges);

      locked.set(false);
      flush(detectChanges);

      expect(field.fieldGroup[0].props.disabled).toBe(true);
    });
  });

  describe('expression check limit', () => {
    let warn: MockInstance;

    beforeEach(() => (warn = vi.spyOn(console, 'warn').mockImplementation(() => {})));
    afterEach(() => warn.mockRestore());

    it('should settle a long nested hide chain when checking a child', () => {
      const fields = Array.from({ length: 151 }, (_, i) => ({
        key: `f${i}`,
        ...(i ? { expressions: { hide: `model.f${i - 1} !== 'Yes'` } } : {}),
      }));
      const field = buildField({
        model: Object.fromEntries(fields.map(({ key }) => [key, 'Yes'])),
        fieldGroup: [{ fieldGroup: fields }],
      });

      field.model.f0 = 'No';
      field.options.checkExpressions(fields[1]);

      expect(field.model).toEqual({ f0: 'No' });
      field.fieldGroup[0].fieldGroup.slice(1).forEach((f) => {
        expect(f.hide).toBe(true);
        expect(f.formControl.parent).toBeNull();
      });
      expect(field.options._hiddenFieldsForCheck).toEqual([]);
      expect(warn).not.toHaveBeenCalled();
    });

    it.each(['expression', 'defaultValue'])(
      'should allow retrying a reset/default cycle after correcting %s',
      (prop) => {
        let checks = 0;
        const field = buildField({
          key: 'x',
          defaultValue: 'Yes',
          model: { enabled: false },
          expressions: {
            hide: ({ model }) => {
              // Keep this test finite if the pass limit regresses.
              if (++checks > 200) {
                throw new Error('Test expression exceeded 200 checks');
              }
              return model.enabled && model.x === 'Yes';
            },
          },
        });

        field.model.enabled = true;
        expect(() => field.options.checkExpressions(field)).toThrow(
          '[Formly Error] Expressions did not settle after 100 passes.',
        );
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith('[Formly] The form may be inconsistent. Check for circular hide expressions');
        expect(field.options._hiddenFieldsForCheck).toEqual([{ field }]);

        if (prop === 'expression') {
          field.expressions.hide = () => true;
        } else {
          field.defaultValue = undefined;
        }
        field.options.checkExpressions(field);

        expect(field.hide).toBe(prop === 'expression');
        expect(field.model).toEqual({ enabled: true });
        expect(field.formControl.value).toBeUndefined();
        expect(field.form.get('x')).toBe(prop === 'expression' ? null : field.formControl);
        expect(field.options._hiddenFieldsForCheck).toEqual([]);
        expect(warn).toHaveBeenCalledTimes(1);
      },
    );

    it('should restore validation and allow rebuilding after an initial hide cycle', () => {
      let checks = 0;
      const builder = createBuilder();
      const form = new FormGroup({}) as FormGroup & { _updateTreeValidity: () => void };
      const root: FormlyFieldConfigCache = {
        form,
        fieldGroup: [
          {
            key: 'x',
            expressions: {
              hide: (field) => {
                if (++checks > 200) {
                  throw new Error('Test expression exceeded 200 checks');
                }
                return !field.hide;
              },
            },
          },
        ],
      };
      const updateTreeValidity = vi.spyOn(form, '_updateTreeValidity');

      expect(() => builder.build(root)).toThrow('Expressions did not settle after 100 passes.');
      expect(warn).toHaveBeenCalledTimes(1);
      form._updateTreeValidity();
      expect(updateTreeValidity).toHaveBeenCalled();

      root.fieldGroup[0].expressions.hide = () => false;
      builder.build(root);

      expect(root.fieldGroup[0].hide).toBe(false);
      expect(root.form.get('x')).toBe(root.fieldGroup[0].formControl);
      expect(root.options._hiddenFieldsForCheck).toEqual([]);
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('should keep the initial budget when expressions add fields', () => {
      let checks = 0;
      const field = buildField({
        key: 'x',
        model: { enabled: false },
        expressions: {
          hide: (field) => {
            if (++checks > 200) {
              throw new Error('Test expression exceeded 200 checks');
            }
            if (field.model.enabled) {
              field.parent.fieldGroup.push({});
              return !field.hide;
            }
            return false;
          },
        },
      });

      field.model.enabled = true;
      expect(() => field.options.checkExpressions(field)).toThrow('Expressions did not settle after 100 passes.');
      expect(field.parent.fieldGroup.length).toBeGreaterThan(100);
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('should release the lock when the initial expression evaluation throws', () => {
      const field = buildField({ key: 'x', expressions: { hide: () => false } });
      field.expressions.hide = () => {
        throw new Error('Invalid expression');
      };

      expect(() => field.options.checkExpressions(field)).toThrow('Invalid expression');
      field.expressions.hide = () => true;
      field.options.checkExpressions(field);

      expect(field.hide).toBe(true);
      expect(field.formControl.parent).toBeNull();
      expect(field.options._hiddenFieldsForCheck).toEqual([]);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe('expressions: field visibility', () => {
    it.each([
      { expressions: { hide: '!!model.hidden' } },
      { expressions: { hide: ({ model }: FormlyFieldConfig) => !!model.hidden } },
      { hideExpression: '!!model.hidden' },
    ])('should restore defaults on rebuild and reset with %p', (config) => {
      const field = buildField({ key: 'foo', defaultValue: 'default', ...config });

      field.parent.model = {};
      field.options.build();
      expect(field.model).toEqual({ foo: 'default' });
      expect(field.formControl.value).toBe('default');

      field.options.resetModel({});
      expect(field.model).toEqual({ foo: 'default' });
      expect(field.formControl.value).toBe('default');

      delete field.model.foo;
      field.options.checkExpressions(field.parent);
      expect(field.model).toEqual({});

      field.parent.model = { hidden: true };
      field.options.build();
      expect(field.hide).toBe(true);
      expect(field.model).toEqual({ hidden: true });
      expect(field.form.get('foo')).toBeNull();
    });

    it.each([null, false, 0, ''])('should preserve supplied value %p when rebuilding a visible field', (value) => {
      const field = buildField({ key: 'foo', defaultValue: 'default', expressions: { hide: () => false } });

      field.parent.model = { foo: value };
      field.options.build();

      expect(field.model).toEqual({ foo: value });
      expect(field.formControl.value).toBe(value);
    });

    it('should clear restored defaults when a later rebuild pass hides their fields', () => {
      const field = buildField({
        model: { mode: 'show' },
        fieldGroup: [
          { key: 'mode', defaultValue: 'hide', expressions: { hide: () => false } },
          {
            key: 'conditional',
            defaultValue: 'default value',
            expressions: { hide: ({ model }) => model.mode === 'hide' },
          },
        ],
      });
      expect(field.model).toEqual({ mode: 'show', conditional: 'default value' });

      field.parent.model = {};
      field.options.build();

      expect(field.model).toEqual({ mode: 'hide' });
      expect(field.fieldGroup[1].hide).toBe(true);
      expect(field.fieldGroup[1].formControl.value).toBeUndefined();
      expect(field.form.get('conditional')).toBeNull();

      field.options.resetModel({ mode: 'show' });
      field.options.resetModel({});
      expect(field.model).toEqual({ mode: 'hide' });
      expect(field.form.value).toEqual({ mode: 'hide' });
    });

    it.each([null, false, 0, '', 'default value'])(
      'should preserve supplied value %p when a restored default hides its group',
      (value) => {
        const field = buildField({
          model: { mode: 'show' },
          fieldGroup: [
            { key: 'mode', defaultValue: 'hide', expressions: { hide: () => false } },
            {
              key: 'group',
              expressions: { hide: (field) => field.parent.model.mode === 'hide' },
              fieldGroup: [
                { key: 'supplied', defaultValue: 'default value' },
                { key: 'restored', defaultValue: 'default value' },
                { key: 'retained', defaultValue: 'keep', resetOnHide: false },
              ],
            },
          ],
        });

        field.parent.model = { group: { supplied: value } };
        field.options.build();

        expect(field.model).toEqual({ mode: 'hide', group: { supplied: value, retained: 'keep' } });
        expect(field.fieldGroup[1].hide).toBe(true);
        expect(field.form.get('group')).toBeNull();
      },
    );

    it.each([false, true])('should clear a shared restored default only if every field is hidden: %p', (hideBoth) => {
      const field = buildField({
        model: { mode: 'show' },
        fieldGroup: [
          { key: 'mode', defaultValue: 'hide', expressions: { hide: () => false } },
          {
            key: 'shared',
            expressions: { hide: ({ model }) => hideBoth && model.mode === 'hide' },
          },
          {
            key: 'shared',
            defaultValue: 'default value',
            expressions: { hide: ({ model }) => model.mode === 'hide' },
          },
        ],
      });

      field.parent.model = {};
      field.options.build();

      expect(field.model).toEqual(hideBoth ? { mode: 'hide' } : { mode: 'hide', shared: 'default value' });
      expect(field.form.get('shared')).toBe(hideBoth ? null : field.fieldGroup[1].formControl);
    });

    it('should restore defaults under an unchanged visible group', () => {
      const field = buildField({
        expressions: { hide: '!!model.hidden' },
        fieldGroup: [
          { key: 'foo', defaultValue: 'default' },
          { key: 'bar', defaultValue: 'other', expressions: { hide: () => false } },
          { key: 'hidden', defaultValue: 'hidden', expressions: { hide: () => true } },
          { hide: true, fieldGroup: [{ key: 'secret', defaultValue: 'hidden' }] },
        ],
      });
      const events = [];
      const subscription = field.options.fieldChanges.subscribe((event) => events.push(event));

      field.parent.model = {};
      field.options.build();

      expect(field.model).toEqual({ foo: 'default', bar: 'other' });
      expect(field.formControl.value).toEqual({ foo: 'default', bar: 'other' });
      expect(events.filter(({ type }) => type === 'hidden')).toEqual([]);
      subscription.unsubscribe();
    });

    it('should evaluate string expression', () => {
      const field = buildField({
        key: 'text',
        expressions: {
          hide: '!model.visibilityToggle',
        },
      });

      expect(field.hide).toBe(true);
      expect(field.props.hidden).toBe(true);

      field.model.visibilityToggle = 'test';
      field.options.checkExpressions(field);

      expect(field.hide).toBe(false);
      expect(field.props.hidden).toBe(false);
    });

    it('should evaluate function expression', () => {
      const field = buildField({
        key: 'text',
        expressions: { hide: () => true },
      });

      expect(field.hide).toBe(true);
    });

    it('should settle chained hide expressions in a single check', () => {
      const field = buildField({
        model: { a: 'Yes', b: 'Yes', c: 'Yes', d: 'Yes', e: 'text' },
        fieldGroup: [
          { key: 'a' },
          { key: 'b', expressions: { hide: "model.a !== 'Yes'" } },
          { key: 'c', expressions: { hide: "model.b !== 'Yes'" } },
          { key: 'd', expressions: { hide: "model.c !== 'Yes'" } },
          { key: 'e', expressions: { hide: "model.d !== 'Yes'" } },
        ],
      });

      field.model.a = 'No';
      field.options.checkExpressions(field.fieldGroup[1]);

      expect(field.model).toEqual({ a: 'No' });
      field.fieldGroup.slice(1).forEach((f) => {
        expect(f.hide).toBe(true);
        expect(f.formControl.value).toBeUndefined();
        expect(f.formControl.parent).toBeNull();
      });
      expect(field.options._hiddenFieldsForCheck).toEqual([]);
    });

    it('should evaluate boolean expression', () => {
      const field = buildField({
        key: 'text',
        hideExpression: true,
      });

      expect(field.hide).toBe(true);
    });

    it('should provide model, formState and field args', () => {
      const spy = vi.fn();
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
        expect(fields[0].hide).toBe(false);
        expect(fields[0].formControl).toBe(form.get('key1'));
        expect(fields[1].hide).toBe(true);
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

        expect(f1.hide).toBe(false);
        expect(f1.formControl).toBe(form.get('key1'));
        expect(f2.hide).toBe(true);
        expect(f2.formControl).not.toBe(form.get('key1'));

        field.model.type = true;
        field.options.checkExpressions(field.parent);
        expect(f1.hide).toBe(true);
        expect(f1.formControl).not.toBe(form.get('key1'));
        expect(f2.hide).toBe(false);
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

      expect(field.hide).toBe(false);
      expect(field.fieldGroup[0].hide).toBe(true);
    });

    it('should ignore validation of hidden fields (same key)', () => {
      const field = buildField({
        fieldGroup: [{ key: 'name', hide: true, props: { required: true } }, { key: 'name' }],
      });

      field.fieldGroup[0].hide = false;

      field.options.checkExpressions(field);
      expect(field.form.valid).toBe(false);
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
      const spy = vi.fn();
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
      vi.spyOn(formControl, 'updateValueAndValidity');

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
      it.each(['function', 'observable'])(
        'should preserve a nested group disabled %s expression when its parent is enabled',
        (source) => {
          let disabled = true;
          const disabled$ = new BehaviorSubject(true);
          const { field, query, detectChanges } = createFieldComponent(
            {
              key: 'outer',
              expressions: { 'props.disabled': () => disabled },
              fieldGroup: [
                {
                  key: 'inner',
                  expressions: { 'props.disabled': source === 'observable' ? disabled$ : () => disabled$.value },
                  fieldGroup: [{ key: 'value', type: 'input', props: { required: true } }],
                },
                { key: 'sibling', defaultValue: 'saved' },
              ],
            },
            { imports: [FormlyInputModule] },
          );
          const [inner, sibling] = field.fieldGroup;

          for (const value of [false, true, false]) {
            disabled = value;
            field.options.detectChanges(field);
            detectChanges();
            expect(inner.props.disabled).toBe(true);
            expect(inner.formControl.disabled).toBe(true);
            expect(query<HTMLInputElement>('input').nativeElement.disabled).toBe(true);
            expect(sibling.formControl.disabled).toBe(value);
          }
          expect(field.form.valid).toBe(true);
          expect(field.form.value).toEqual({ outer: { sibling: 'saved' } });

          disabled$.next(false);
          field.options.detectChanges(field);
          detectChanges();
          expect(query<HTMLInputElement>('input').nativeElement.disabled).toBe(false);
          expect(field.form.invalid).toBe(true);
        },
      );

      it('should leave a group with only disabled children unchanged on repeated expression checks', () => {
        const field = buildField({
          key: 'group',
          expressions: { 'props.disabled': () => false },
          fieldGroup: [{ key: 'child', expressions: { 'props.disabled': () => true } }],
        });
        const enable = vi.spyOn(field.formControl, 'enable');
        const disable = vi.spyOn(field.formControl, 'disable');

        field.options.checkExpressions(field.parent);
        field.options.checkExpressions(field.parent);

        expect(field.props.disabled).toBe(false);
        expect(field.formControl.disabled).toBe(true);
        expect(enable).not.toHaveBeenCalled();
        expect(disable).not.toHaveBeenCalled();
      });

      it('should not disable the shared control of a keyless group', () => {
        const field = buildField({
          fieldGroup: [
            {
              expressions: { 'props.disabled': () => true },
              fieldGroup: [{ key: 'child', expressions: { 'props.disabled': () => false } }],
            },
            { key: 'sibling' },
          ],
        });

        field.options.checkExpressions(field.parent);

        expect(field.fieldGroup[0].fieldGroup[0].formControl.disabled).toBe(true);
        expect(field.fieldGroup[1].formControl.enabled).toBe(true);
        expect(field.formControl.enabled).toBe(true);
      });

      it.each(['props.disabled', 'templateOptions.disabled'])(
        'should preserve a child %s expression when its parent is enabled',
        (property) => {
          let disabled = true;
          const field = buildField({
            key: 'group',
            expressions: { [property]: () => disabled },
            fieldGroup: [
              { key: 'child', expressions: { [property]: () => true } },
              { key: 'sibling', expressions: { [property]: () => false } },
            ],
          });
          const [child, sibling] = field.fieldGroup;

          for (const value of [false, true, false]) {
            disabled = value;
            field.options.checkExpressions(field.parent);
            expect(child.props.disabled).toBe(true);
            expect(child.formControl.disabled).toBe(true);
            expect(sibling.props.disabled).toBe(value);
            expect(sibling.formControl.disabled).toBe(value);
          }
        },
      );

      it('should preserve observable child disabled expressions when its parent is enabled', () => {
        let disabled = true;
        const disabled$ = new Subject<boolean>();
        const field = buildField({
          key: 'group',
          expressions: { 'props.disabled': () => disabled },
          fieldGroup: [{ key: 'child', expressions: { 'props.disabled': disabled$ } }],
        });
        const [child] = field.fieldGroup;
        const subscription = (child as FormlyFieldConfigCache)._expressions['props.disabled'].value$.subscribe();

        disabled$.next(true);
        disabled = false;
        field.options.checkExpressions(field.parent);
        expect(child.props.disabled).toBe(true);
        expect(child.formControl.disabled).toBe(true);

        disabled$.next(false);
        field.options.checkExpressions(field.parent);
        expect(child.formControl.enabled).toBe(true);
        subscription.unsubscribe();
      });

      it('should update field disabled state', () => {
        const field = buildField({
          key: 'text',
          expressions: {
            'props.disabled': 'model.disableToggle',
          },
        });

        expect(field.props.disabled).toBe(false);

        field.model.disableToggle = 'test';
        field.options.checkExpressions(field);

        expect(field.props.disabled).toBe(true);
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

        expect(field.props.disabled).toBe(true);
        expect(field.fieldGroup[0].props.disabled).toBe(true);
        expect(field.fieldGroup[1].props.label).toEqual('Street');

        disabled.address = false;
        field.options.checkExpressions(field);

        expect(field.props.disabled).toBe(false);
        expect(field.fieldGroup[0].props.disabled).toBe(false);

        disabled.city = true;
        field.options.checkExpressions(field);

        expect(field.props.disabled).toBe(false);
        expect(field.fieldGroup[0].props.disabled).toBe(true);
      });

      it('should not cascade disabled state to children when cascadeDisabled is false on fieldGroup', () => {
        const field = buildField({
          cascadeDisabled: false,
          props: { disabled: true },
          fieldGroup: [
            {
              key: 'child',
              props: { label: 'Child' },
              expressions: { 'props.disabled': () => false },
            },
            {
              key: 'sibling',
              props: { disabled: false },
            },
          ],
        });

        expect(field.props.disabled).toBe(true);
        expect(field.fieldGroup[0].props.disabled).toBe(false);
        expect(field.fieldGroup[0].formControl.enabled).toBe(true);
        expect(field.fieldGroup[1].props.disabled).toBe(false);
        expect(field.fieldGroup[1].formControl.enabled).toBe(true);
      });

      it('should stop disabled lookup when an intermediate group has cascadeDisabled set to false', () => {
        let outerDisabled = true;
        const field = buildField({
          key: 'outer',
          expressions: { 'props.disabled': () => outerDisabled },
          fieldGroup: [
            {
              key: 'intermediate',
              cascadeDisabled: false,
              fieldGroup: [
                {
                  key: 'child',
                  expressions: { 'props.disabled': () => false },
                },
              ],
            },
          ],
        });

        field.options.checkExpressions(field.parent);
        const child = field.fieldGroup[0].fieldGroup[0];
        expect(field.props.disabled).toBe(true);
        expect(child.props.disabled).toBe(false);
        expect(child.formControl.enabled).toBe(true);

        outerDisabled = false;
        field.options.checkExpressions(field.parent);
        expect(field.props.disabled).toBe(false);
        expect(child.props.disabled).toBe(false);
        expect(child.formControl.enabled).toBe(true);
      });

      it('should stop disabled lookup when intermediate group has static cascadeDisabled: false and outer group is static disabled', () => {
        const field = buildField({
          key: 'outer',
          props: { disabled: true },
          fieldGroup: [
            {
              key: 'intermediate',
              cascadeDisabled: false,
              fieldGroup: [
                {
                  key: 'child',
                  expressions: { 'props.disabled': () => false },
                },
              ],
            },
          ],
        });

        field.options.checkExpressions(field.parent);
        const child = field.fieldGroup[0].fieldGroup[0];
        expect(field.props.disabled).toBe(true);
        expect(child.props.disabled).toBe(false);
        expect(child.formControl.enabled).toBe(true);
      });

      it('should not recursively disable child controls when keyed group with cascadeDisabled: false is toggled by expression', () => {
        let groupDisabled = false;
        const field = buildField({
          key: 'group',
          cascadeDisabled: false,
          expressions: { 'props.disabled': () => groupDisabled },
          fieldGroup: [{ key: 'child1' }, { key: 'child2', expressions: { 'props.disabled': () => false } }],
        });

        const [child1, child2] = field.fieldGroup;

        field.options.checkExpressions(field.parent);
        expect(field.props.disabled).toBe(false);
        expect(child1.formControl.enabled).toBe(true);
        expect(child2.formControl.enabled).toBe(true);
        expect(field.formControl.enabled).toBe(true);

        groupDisabled = true;
        field.options.checkExpressions(field.parent);
        expect(field.props.disabled).toBe(true);
        expect(child1.formControl.enabled).toBe(true);
        expect(child2.formControl.enabled).toBe(true);
        expect(field.formControl.enabled).toBe(true);

        const onChange = vi.fn();
        const subscription = field.options.fieldChanges.subscribe(onChange);
        field.options.build();
        expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'expressionChanges' }));
        subscription.unsubscribe();

        groupDisabled = false;
        field.options.checkExpressions(field.parent);
        expect(field.props.disabled).toBe(false);
        expect(child1.formControl.enabled).toBe(true);
        expect(child2.formControl.enabled).toBe(true);
        expect(field.formControl.enabled).toBe(true);
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

        expect(field.props.disabled).toBe(false);
        expect(field.fieldGroup[0].props.disabled).toBe(false);

        field.model.disableToggle = true;
        field.options.checkExpressions(field.parent);

        expect(field.props.disabled).toBe(true);
        expect(field.fieldGroup[0].props.disabled).toBe(true);
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

        expect(build).toThrow(
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
        const spy = vi.fn();
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
        const spy = vi.fn();
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
      const fieldChanges = new Subject<FormlyValueChangeEvent>();
      const spy = vi.fn();
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

    it('emits on the first successful assignment after a failed build', () => {
      const field: FormlyFieldConfig = { key: 'item', expressions: { 'props.nested.label': () => 'Ready' } };
      const fieldChanges = new Subject<FormlyValueChangeEvent>();
      const next = vi.fn();
      fieldChanges.subscribe(next);
      const root = { fieldGroup: [field], options: { fieldChanges } };
      const builder = createBuilder();

      expect(() => builder.build(root)).toThrow('props.nested.label');
      expect(next).not.toHaveBeenCalled();
      field.props.nested = {};
      builder.build(root);
      expect(field.props.nested.label).toBe('Ready');
      expect(next).toHaveBeenCalledExactlyOnceWith({
        field,
        type: 'expressionChanges',
        property: 'props.nested.label',
        value: 'Ready',
      });
      builder.build(root);
      expect(next).toHaveBeenCalledOnce();
    });

    describe('review theories: rebuild emission', () => {
      const expressionEvents = (spy: MockInstance) =>
        spy.mock.calls.filter(([e]) => e.type === 'expressionChanges').map(([e]) => e);

      it('T1a: should not emit on rebuild when an undefined expression stays undefined', () => {
        const spy = vi.fn();
        const field = buildField({ key: 'text', expressions: { 'props.description': () => undefined } });
        const subscription = field.options.fieldChanges.subscribe(spy);

        field.options.checkExpressions(field.parent, true);
        expect(expressionEvents(spy)).toEqual([]);
        subscription.unsubscribe();
      });

      it('T1b: should not emit on the first rebuild after a partially built field was only checked normally', () => {
        const group = buildField({ fieldGroup: [{ key: 'first' }] });
        const root = group.parent;
        const spy = vi.fn();
        const subscription = root.options.fieldChanges.subscribe(spy);

        // A partial build of a nested group does not run checkExpressions(_, true) for the new child.
        const added: FormlyFieldConfigCache = { key: 'added', expressions: { 'props.description': () => undefined } };
        group.fieldGroup.push(added);
        root.options.build(group);
        root.options.checkExpressions(root);
        expect(expressionEvents(spy)).toEqual([]);

        root.options.build();
        expect(expressionEvents(spy)).toEqual([]);
        subscription.unsubscribe();
      });

      it('should not throw on a normal check when a Map or Set holds a circular value', () => {
        const node: any = { name: 'a' };
        node.self = node;
        const field = buildField({ key: 'item', expressions: { 'props.options': () => new Map([['a', node]]) } });

        expect(() => field.options.checkExpressions(field.parent)).not.toThrow();
        expect(() => field.options.build()).not.toThrow();
      });

      it.each([
        ['Map', () => new Map([['a', 1]]), (v: Map<string, number>) => v.set('b', 2)],
        ['Set', () => new Set([1]), (v: Set<number>) => v.add(2)],
      ])('T2: should emit on rebuild when the same %s is mutated in place', (_name, create, mutate) => {
        const value: any = create();
        const field = buildField({ key: 'item', expressions: { 'props.options': () => value } });
        const spy = vi.fn();
        const subscription = field.options.fieldChanges.subscribe(spy);

        mutate(value);
        field.options.build();
        expect(expressionEvents(spy)).toHaveLength(1);
        subscription.unsubscribe();
      });

      it('should not emit on rebuild when a Date expression is unchanged', () => {
        const field = buildField({ key: 'item', expressions: { 'props.min': () => new Date(2020, 0, 1) } });
        const spy = vi.fn();
        const subscription = field.options.fieldChanges.subscribe(spy);

        field.options.build();
        expect(expressionEvents(spy)).toEqual([]);
        subscription.unsubscribe();
      });

      it('should not emit on rebuild for an unchanged observable expression', () => {
        const label = new BehaviorSubject('Label');
        const { field, detectChanges } = createFieldComponent(
          { key: 'name', type: 'input', expressions: { 'props.label': label } },
          { imports: [FormlyInputModule] },
        );
        const spy = vi.fn();
        const subscription = field.options.fieldChanges.subscribe(spy);

        field.options.build();
        detectChanges();
        expect(expressionEvents(spy)).toEqual([]);
        expect(field.props.label).toBe('Label');
        subscription.unsubscribe();
      });

      it('should emit one expressionChanges and one hidden event when hide flips during a rebuild', () => {
        const field = buildField({ key: 'text', expressions: { hide: '!model.show' }, model: { show: true } });
        const spy = vi.fn();
        const subscription = field.options.fieldChanges.subscribe(spy);

        field.model.show = false;
        field.options.build();
        expect(expressionEvents(spy)).toEqual([{ field, type: 'expressionChanges', property: 'hide', value: true }]);
        expect(spy.mock.calls.filter(([e]) => e.type === 'hidden' && e.field === field).map(([e]) => e)).toEqual([
          { field, type: 'hidden', value: true },
        ]);
        subscription.unsubscribe();
      });
    });

    it('should not emit expressionChanges on rebuild when the value is unchanged', () => {
      const fieldChanges = new Subject<any>();
      const spy = vi.fn();
      const subscription = fieldChanges.subscribe(spy);

      const field = buildField({
        key: 'text',
        options: { fieldChanges },
        expressions: {
          hide: '!model.visibilityToggle',
          'props.label': 'model.label',
        },
        model: { label: 'foo' },
      });
      expect(spy.mock.calls.filter(([e]) => e.type === 'expressionChanges')).toHaveLength(2);

      spy.mockReset();
      field.options.checkExpressions(field.parent, true);
      expect(spy.mock.calls.filter(([e]) => e.type === 'expressionChanges')).toHaveLength(0);
      expect(field.props.label).toBe('foo');

      subscription.unsubscribe();
    });

    it('should emit expressionChanges when a rebuild corrects the disabled state', () => {
      const field = buildField({
        key: 'input',
        expressions: { 'props.disabled': () => true },
      });
      const spy = vi.fn();
      const subscription = field.options.fieldChanges.subscribe(spy);

      field.props.disabled = false;
      expect(field.formControl.enabled).toBe(true);

      field.options.build();

      expect(field.formControl.disabled).toBe(true);
      expect(spy).toHaveBeenCalledExactlyOnceWith({
        field,
        type: 'expressionChanges',
        property: 'props.disabled',
        value: true,
      });

      field.options.build();
      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });

    it('should emit expressionChanges on rebuild when the value changed', () => {
      const fieldChanges = new Subject<any>();
      const spy = vi.fn();
      const subscription = fieldChanges.subscribe(spy);

      const field = buildField({
        key: 'text',
        options: { fieldChanges },
        expressions: { 'props.label': 'model.label' },
        model: { label: 'foo' },
      });

      spy.mockReset();
      field.model.label = 'bar';
      field.options.checkExpressions(field.parent, true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ field, type: 'expressionChanges', property: 'props.label', value: 'bar' });
      expect(field.props.label).toBe('bar');

      subscription.unsubscribe();
    });

    describe.each(['function', 'signal'])('%s expression serialization', (source) => {
      const circular: any = {};
      circular.self = circular;

      it('should emit mutated option values once on rebuild', () => {
        const options = signal([{ label: 'First', value: 1 }]);
        const field = buildField({
          key: 'item',
          expressions: { 'props.options': source === 'signal' ? options : () => options() },
        });
        const spy = vi.fn();
        const subscription = field.options.fieldChanges.subscribe(spy);

        // A normal check must also refresh the snapshot used by the next rebuild.
        options.set([{ label: 'Second', value: 2 }]);
        field.options.checkExpressions(field.parent);
        expect(spy).toHaveBeenCalledExactlyOnceWith({
          field,
          type: 'expressionChanges',
          property: 'props.options',
          value: options(),
        });
        spy.mockClear();
        field.options.build();
        expect(spy).not.toHaveBeenCalled();

        options().push({ label: 'Third', value: 3 });
        field.options.build();
        expect(spy).toHaveBeenCalledExactlyOnceWith({
          field,
          type: 'expressionChanges',
          property: 'props.options',
          value: options(),
        });
        spy.mockClear();
        field.options.build();
        expect(spy).not.toHaveBeenCalled();
        subscription.unsubscribe();
      });

      it.each([
        ['circular', circular],
        ['bigint', BigInt(1)],
      ])('should apply %s option values on the initial build', (_name, value) => {
        const options = [{ label: 'Item', value }];
        const fieldChanges = new Subject<any>();
        const spy = vi.fn();
        const subscription = fieldChanges.subscribe(spy);
        const field = buildField({
          key: 'item',
          options: { fieldChanges },
          expressions: { 'props.options': source === 'signal' ? signal(options) : () => options },
        });

        expect(field.props.options).toBe(options);
        expect(spy).toHaveBeenCalledExactlyOnceWith({
          field,
          type: 'expressionChanges',
          property: 'props.options',
          value: options,
        });

        spy.mockClear();
        field.options.build();
        expect(field.props.options).toBe(options);
        expect(spy).not.toHaveBeenCalled();
        subscription.unsubscribe();
      });

      it.each([
        ['circular', circular],
        ['bigint', BigInt(1)],
        ['serializable', 1],
      ])('should apply new %s option values on rebuild', (name, value) => {
        const initial = [{ label: 'Item', value: 0 }];
        const options = signal(initial);
        const fieldChanges = new Subject<any>();
        const spy = vi.fn();
        const subscription = fieldChanges.subscribe(spy);
        const field = buildField({
          key: 'item',
          options: { fieldChanges },
          expressions: { 'props.options': source === 'signal' ? options : () => options() },
        });

        for (const { next, count } of [
          { next: [{ label: 'Item', value }], count: 1 },
          { next: [{ label: 'Item', value }], count: name === 'serializable' ? 0 : 1 },
          { next: initial, count: 1 },
        ]) {
          spy.mockClear();
          options.set(next);
          field.options.build();
          expect(field.props.options).toBe(next);
          expect(spy).toHaveBeenCalledTimes(count);

          spy.mockClear();
          field.options.build();
          expect(spy).not.toHaveBeenCalled();
        }
        subscription.unsubscribe();
      });
    });

    it('should emit fieldChanges when expression value changes', () => {
      const fieldChanges = new Subject<FormlyValueChangeEvent>();
      const spy = vi.fn();
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
