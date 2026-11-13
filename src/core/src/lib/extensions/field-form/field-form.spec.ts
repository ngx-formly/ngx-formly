import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { disabled, required } from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { createBuilder, createFieldComponent, FormlyInputModule } from '@ngx-formly/core/testing';
import { FormlyFieldConfigCache } from '../../models';

function buildField({ model, options, form, ...field }: FormlyFieldConfigCache): FormlyFieldConfigCache {
  const builder = createBuilder({
    extensions: ['core', 'validation', 'form'],
  });

  builder.build({
    model: model || {},
    options,
    form,
    fieldGroup: [field],
  });

  return field;
}

describe('FieldFormExtension', () => {
  describe('assign model field to form control', () => {
    it('should match undefined model value', () => {
      const { form } = buildField({
        model: { foo: null },
        fieldGroup: [{ key: 'foo' }, { key: 'bar' }],
      });

      expect(form.get('bar').value).toBeUndefined();
      expect(form.get('foo').value).toBeNull();
    });

    it('should assign model for nested field key', () => {
      const { form } = buildField({
        key: 'address.city',
        model: { address: { city: 'test' } },
      });

      expect(form.get('address.city')).not.toBeNull();
      expect(form.get('address.city').value).toEqual('test');
    });

    it('should assign model for nested field integer key', () => {
      const { form } = buildField({
        key: 'a.1',
        model: { a: ['foo', 'bar'] },
      });

      expect(form.get('a.1').value).toEqual('bar');
    });

    it('should assign model for nested field fieldGroup', () => {
      const { form } = buildField({
        key: 'a.b',
        fieldGroup: [{ key: 'c' }],
        model: { a: { b: { c: 'foo' } } },
      });

      expect(form.get('a.b').value).toEqual({ c: 'foo' });
    });
  });

  describe('field', () => {
    it('should assign parent form to field', () => {
      const field = buildField({ key: 'title' });

      expect(field.form instanceof FormGroup).toBe(true);
      expect(field.form).toBe(field.parent.formControl as FormGroup);
    });

    it('should assign parent form to root field', () => {
      const field = buildField({
        key: 'title',
        formControl: new FormControl(),
      });

      expect(field.form).toBe(field.formControl.parent as FormGroup);
    });

    it('should create formControl when key exist', () => {
      const field = buildField({ key: 'title' });

      expect(field.formControl instanceof FormControl).toBe(true);
    });

    it('should add formControl for field with empty key', () => {
      const field = buildField({ defaultValue: 5 });

      expect(field.formControl).toBeDefined();
      expect(field.formControl.value).toEqual(5);

      field['_validators'] = [Validators.min(10)];
      field.options.build(field.parent);

      expect(field.formControl.validator).not.toBeNull();
    });

    it('should update initial defaultValue on build', () => {
      const field = buildField({
        key: 'name',
        defaultValue: 6,
        form: new FormGroup({ name: new FormControl(5, { initialValueIsDefault: true }) }),
      });

      expect((field.formControl as FormControl).defaultValue).toEqual(6);
    });

    it('should reuse an existing SignalFormControl without calling the imperative validator setters', () => {
      const name = TestBed.runInInjectionContext(() => new SignalFormControl('foo'));
      const field = buildField({ key: 'name', form: new FormGroup({ name }), model: { name: 'foo' } });

      expect(field.formControl).toBe(name);
      expect(field.formControl.value).toEqual('foo');
    });

    it('should update the parent form when a SignalFormControl rule changes its status', () => {
      const isRequired = signal(true);
      const isDisabled = signal(false);
      const name = TestBed.runInInjectionContext(
        () =>
          new SignalFormControl('', (p) => {
            required(p, { when: () => isRequired() });
            disabled(p, { when: () => isDisabled() });
          }),
      );
      const form = new FormGroup({ name, age: new FormControl(25) });
      buildField({ fieldGroup: [{ key: 'name' }, { key: 'age' }], form, model: { name: '', age: 25 } });
      TestBed.tick();
      expect(form.status).toEqual('INVALID');

      isRequired.set(false);
      TestBed.tick();
      expect(form.status).toEqual('VALID');

      isDisabled.set(true);
      TestBed.tick();
      expect(form.value).toEqual({ age: 25 });
    });

    it('should use the same formcontrol for fields that use the same key', () => {
      const {
        fieldGroup: [f1, f2],
      } = buildField({
        fieldGroup: [{ key: 'test' }, { key: 'test' }],
      });

      expect(f1.formControl).toEqual(f2.formControl);
    });
  });

  describe('fieldGroup', () => {
    it('should create FormGroup control when fieldGroup and key are set', () => {
      const field = buildField({ key: 'test', fieldGroup: [] });

      expect(field.formControl instanceof FormGroup).toBe(true);
    });

    it('should assign parent formcontrol when key is empty', () => {
      const field = buildField({ fieldGroup: [] });

      expect(field.formControl).toEqual(field.form);
    });

    it('should assign parent formcontrol when key is an empty string', () => {
      const field = buildField({ key: '', fieldGroup: [] });
      expect(field.formControl).toEqual(field.form);
    });
  });

  it('should use existing formcontrol from built form', () => {
    const fooControl = new FormControl();
    const field = buildField({
      key: 'foo',
      form: new FormGroup({ foo: fooControl }),
    });

    expect(field.formControl).toBe(fooControl);
  });

  it('should ignore fieldArray', () => {
    const field = buildField({ key: 'test', fieldArray: { key: 'test' } });
    expect(field.formControl).toBeUndefined();
  });

  it('should override existing formcontrol when key is empty', () => {
    const field = buildField({
      fieldGroup: [],
      formControl: new FormControl(),
    });

    expect(field.formControl).toEqual(field.form);
  });

  it('should update the formcontrol validation when field update', () => {
    const formControl = new FormControl();
    vi.spyOn(formControl, 'setValidators');
    vi.spyOn(formControl, 'setAsyncValidators');
    vi.spyOn(formControl, 'updateValueAndValidity');
    buildField({
      key: 'test',
      formControl,
      props: { required: true },
      form: new FormGroup({ test: formControl }),
      asyncValidators: {
        custom: () => new Promise(null),
      },
    });

    expect(formControl.setValidators).toHaveBeenCalledTimes(1);
    expect(formControl.setAsyncValidators).toHaveBeenCalledTimes(1);
    expect(formControl.updateValueAndValidity).toHaveBeenCalledTimes(1);
  });

  it('should not call "setAsyncValidators" when no asyncValidator is present in field', () => {
    const formControl = new FormControl();
    vi.spyOn(formControl, 'setAsyncValidators');
    buildField({
      key: 'test',
      formControl,
      props: { required: true },
      form: new FormGroup({ test: formControl }),
    });

    expect(formControl.setAsyncValidators).not.toHaveBeenCalled();
  });

  it('should updateValueAndValidity of detached field', () => {
    const formControl = new FormControl();
    vi.spyOn(formControl, 'updateValueAndValidity');

    buildField({
      key: 'test',
      _hide: true,
      formControl,
      props: { required: true },
    });

    expect(formControl.parent).toBeNull();
    expect(formControl.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should not override existing validation when re-build form', () => {
    const formControl = new FormControl();
    const field = {
      key: 'test',
      formControl,
      form: new FormGroup({ test: formControl }),
    };

    buildField(field);

    vi.spyOn(formControl, 'setValidators');
    vi.spyOn(formControl, 'setAsyncValidators');

    buildField(field);

    expect(formControl.setValidators).not.toHaveBeenCalled();
    expect(formControl.setAsyncValidators).not.toHaveBeenCalled();
  });

  it('should validate fieldGroup with empty key', () => {
    const { form } = buildField({
      fieldGroup: [
        {
          fieldGroup: [],
          validators: {
            custom: { expression: (control: AbstractControl) => control.value === 'test' },
          },
        },
      ],
    });

    expect(form.errors).toEqual({ custom: true });
  });

  describe('props disabled state', () => {
    it('should disable field without key', () => {
      const field = buildField({
        props: { disabled: true },
      });

      const control = field.formControl;
      expect(control.disabled).toBe(true);
    });

    it('should disable sub-fields when parent is disabled', () => {
      const field = buildField({
        key: 'address',
        props: { disabled: true },
        fieldGroup: [{ key: 'city' }, { key: 'street' }],
      });

      const control = field.formControl;
      expect(control.disabled).toBe(true);
      expect(control.get('city').disabled).toBe(true);
      expect(control.get('street').disabled).toBe(true);
    });

    it('should not affect parent disabled state', () => {
      const field = buildField({
        key: 'address',
        fieldGroup: [{ key: 'city', props: { disabled: true } }, { key: 'street' }],
      });

      const control = field.formControl;
      expect(control.disabled).toBe(false);
      expect(control.get('city').disabled).toBe(true);
      expect(control.get('street').disabled).toBe(false);
    });

    it('should enable previously disabled control', () => {
      const { form } = buildField({
        fieldGroup: [
          {
            key: 'foo',
            props: { disabled: true },
          },
          {
            key: 'bar',
            props: { disabled: true },
          },
        ],
      });

      expect(form.get('foo').disabled).toEqual(true);
      expect(form.get('bar').disabled).toEqual(true);

      buildField({
        form,
        fieldGroup: [
          {
            key: 'foo',
            props: { disabled: true },
          },
          { key: 'bar' },
        ],
      });

      expect(form.get('foo').disabled).toEqual(true);
      expect(form.get('bar').disabled).toEqual(false);
    });
  });

  describe('signalForms option (experimental)', () => {
    function buildSignalField(field: FormlyFieldConfigCache, model: any): FormlyFieldConfigCache {
      const builder = createBuilder();
      const form = new FormGroup({});
      // createBuilder has no injector, so SignalFormControl falls back to inject().
      TestBed.runInInjectionContext(() =>
        builder.build({ model, form, options: { signalForms: true }, fieldGroup: [field] }),
      );
      TestBed.tick();

      return field;
    }

    it('should create a SignalFormControl with the model value', () => {
      const field = buildSignalField({ key: 'name' }, { name: 'foo' });

      expect(field.formControl).toBeInstanceOf(SignalFormControl);
      expect(field.formControl.value).toEqual('foo');
      expect(field.form.value).toEqual({ name: 'foo' });
    });

    it('should apply props.required as a rule and follow its changes', () => {
      const field = buildSignalField({ key: 'name', props: { required: true } }, { name: '' });

      expect(field.formControl.errors).toEqual({ required: expect.anything() });
      expect(field.form.status).toEqual('INVALID');

      field.props.required = false;
      TestBed.tick();
      expect(field.formControl.errors).toBeNull();
      expect(field.form.status).toEqual('VALID');
    });

    it('should apply props.disabled as a rule and follow its changes', () => {
      const field = buildSignalField(
        { fieldGroup: [{ key: 'name', props: { disabled: true } }, { key: 'age' }] },
        { name: 'foo', age: 25 },
      );
      const [name] = field.fieldGroup;

      expect(name.formControl.disabled).toBe(true);
      expect(field.form.value).toEqual({ age: 25 });

      name.props.disabled = false;
      TestBed.tick();
      expect(name.formControl.disabled).toBe(false);
      expect(field.form.value).toEqual({ name: 'foo', age: 25 });
    });

    it('should support a signal expression on props.disabled', () => {
      const locked = signal(false);
      const { field, query, detectChanges } = createFieldComponent(
        { key: 'name', type: 'input', expressions: { 'props.disabled': locked }, options: { signalForms: true } },
        { imports: [FormlyInputModule] },
      );
      const input = (): HTMLInputElement => query<HTMLInputElement>('input').nativeElement;
      expect(field.formControl).toBeInstanceOf(SignalFormControl);
      expect(input().disabled).toBe(false);

      locked.set(true);
      TestBed.tick();
      detectChanges();
      expect(field.formControl.disabled).toBe(true);
      expect(input().disabled).toBe(true);
    });

    it('should keep creating a FormControl when the option is off', () => {
      const field = buildField({ key: 'name' });

      expect(field.formControl).toBeInstanceOf(FormControl);
    });
  });

  // Existing configuration must behave the same with the option on.
  describe.each([false, true])('existing configuration with signalForms: %s', (signalForms: boolean) => {
    function build(field: FormlyFieldConfigCache, model: Record<string, unknown>): FormlyFieldConfigCache {
      const builder = createBuilder();
      // createBuilder has no injector, so SignalFormControl falls back to inject().
      TestBed.runInInjectionContext(() =>
        builder.build({ model, form: new FormGroup({}), options: { signalForms }, fieldGroup: [field] }),
      );
      TestBed.tick();

      return field;
    }

    it('should apply props.min', () => {
      const field = build({ key: 'age', props: { min: 18 } }, { age: 10 });

      expect(field.formControl.errors).toEqual({ min: { min: 18, actual: 10 } });
      expect(field.form.status).toEqual('INVALID');
    });

    it('should revalidate when a validation prop changes', () => {
      const field = build({ key: 'age', props: { min: 18 } }, { age: 10 });

      field.props.min = 5;
      TestBed.tick();

      expect(field.formControl.errors).toBeNull();
      expect(field.form.status).toEqual('VALID');
    });

    it('should apply a custom validator', () => {
      const field = build(
        {
          key: 'code',
          validators: { digits: { expression: (c: AbstractControl) => /^\d+$/.test(c.value), message: 'Digits only' } },
        },
        { code: 'abc' },
      );
      expect(field.formControl.errors).toEqual({ digits: { message: 'Digits only' } });

      field.formControl.setValue('123');
      TestBed.tick();
      expect(field.formControl.errors).toBeNull();
    });

    it('should support form.disable() and form.enable()', () => {
      const field = build({ key: 'name' }, { name: 'foo' });

      field.form.disable();
      TestBed.tick();
      expect(field.formControl.disabled).toBe(true);

      field.form.enable();
      TestBed.tick();
      expect(field.formControl.disabled).toBe(false);
    });

    it('should inherit disabled state from a keyed parent group', () => {
      const field = build(
        { key: 'address', props: { disabled: true }, fieldGroup: [{ key: 'city' }] },
        { address: { city: 'Bern' } },
      );

      expect(field.formControl.get('city').disabled).toBe(true);
    });

    it('should follow a disabled expression on a keyed parent group', () => {
      const field = build(
        {
          key: 'address',
          expressions: { 'props.disabled': (f) => !!f.options.formState.locked },
          fieldGroup: [{ key: 'city' }],
        },
        { address: { city: 'Bern' } },
      );
      const city = field.formControl.get('city');
      expect(city.disabled).toBe(false);

      field.options.formState.locked = true;
      field.options.checkExpressions(field.parent);
      TestBed.tick();
      expect(city.disabled).toBe(true);

      field.options.formState.locked = false;
      field.options.checkExpressions(field.parent);
      TestBed.tick();
      expect(city.disabled).toBe(false);
    });

    // Pending for signalForms: not forwarded yet.
    it.skipIf(signalForms)('should route a group validator error to a child through errorPath', () => {
      const field = build(
        {
          key: 'range',
          validators: {
            endAfterStart: {
              expression: (c: AbstractControl) => c.value.end > c.value.start,
              errorPath: 'end',
            },
          },
          fieldGroup: [{ key: 'start' }, { key: 'end' }],
        },
        { range: { start: 3, end: 2 } },
      );
      const end = field.formControl.get('end');
      expect(end.hasError('endAfterStart')).toBe(true);
      expect(field.form.status).toEqual('INVALID');

      end.setValue(4);
      TestBed.tick();
      expect(end.hasError('endAfterStart')).toBe(false);
      expect(field.form.status).toEqual('VALID');
    });

    // Pending for signalForms: not forwarded yet.
    it.skipIf(signalForms)('should update the control on blur with updateOn: blur', () => {
      const { field, query, detectChanges } = createFieldComponent(
        {
          key: 'name',
          type: 'input',
          model: { name: 'Alice' },
          modelOptions: { updateOn: 'blur' },
          options: { signalForms },
        } as FormlyFieldConfigCache,
        { imports: [FormlyInputModule] },
      );
      const input: HTMLInputElement = query<HTMLInputElement>('input').nativeElement;

      input.value = 'Bob';
      input.dispatchEvent(new Event('input'));
      TestBed.tick();
      detectChanges();
      expect(field.formControl.value).toEqual('Alice');

      input.dispatchEvent(new Event('blur'));
      TestBed.tick();
      detectChanges();
      expect(field.formControl.value).toEqual('Bob');
    });
  });
});
