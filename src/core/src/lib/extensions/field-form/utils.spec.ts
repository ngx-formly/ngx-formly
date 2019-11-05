import { unregisterControl, registerControl } from './utils';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

describe('registerControl', () => {
  it('FormArray', () => {
    const field = {
      key: '0',
      formControl: new FormControl(),
      form: new FormArray([]) as any,
      parent: {
        model: {},
      },
    };

    registerControl(field);
    expect(field.formControl.parent).not.toBeNull();
    expect(field.form.controls.length).toEqual(1);
    expect(field.form.get('0')).toEqual(field.formControl);
  });

  it('FormGroup', () => {
    const field = {
      key: '0',
      formControl: new FormControl(),
      form: new FormGroup({}),
      parent: {
        model: {},
      },
    };

    registerControl(field);
    expect(field.form.get('0')).toEqual(field.formControl);
    expect(field.formControl.parent).not.toBeNull();
  });

  it('FormGroup with nested field key', () => {
    const field = {
      key: 'test.0',
      formControl: new FormControl(),
      form: new FormGroup({ test: new FormGroup({}) }),
      parent: {
        model: {},
      },
    };

    registerControl(field);
    expect(field.form.get('test.0')).toEqual(field.formControl);
    expect(field.formControl.parent).not.toBeNull();
  });

  it('FormGroup with field array key', () => {
    const field = {
      key: ['test.0', '111'],
      formControl: new FormControl(),
      parent: {
        formControl: new FormGroup({}),
        model: {},
      },
    };

    registerControl(field);
    expect(field.formControl.parent).not.toBeNull();
  });

  it('should keep disabled state in sync with "templateOptions.disabled"', () => {
    const field: FormlyFieldConfig = {
      key: 'test',
      templateOptions: { disabled: false },
      parent: {},
    };

    registerControl(field, new FormControl());
    field.templateOptions.disabled = true;
    expect(field.formControl.disabled).toEqual(true);

    field.templateOptions.disabled = false;
    expect(field.formControl.disabled).toEqual(false);

    field.formControl.disable();
    expect(field.templateOptions.disabled).toEqual(true);

    field.formControl.enable();
    expect(field.templateOptions.disabled).toEqual(false);
  });

  it('should replace existing control with the field one', () => {
    const field = {
      key: '0',
      formControl: new FormControl(),
      form: new FormArray([new FormControl()]) as any,
      parent: {
        model: {},
      },
    };

    registerControl(field);
    expect(field.form.get('0')).toEqual(field.formControl);
  });

  it('should take account of model changes', () => {
    const field = {
      key: '0',
      formControl: new FormControl(),
      form: new FormGroup({}),
      parent: {
        model: { '0': 'test' },
      },
    };

    registerControl(field);
    expect(field.formControl.value).toEqual('test');
  });

  describe('emit event', () => {
    it('should not emit valueChanges on register by default', () => {
      const form = new FormGroup({});
      const field = {
        key: 'foo',
        form,
        formControl: new FormControl(),
        parent: { model: {} },
      };

      const spy = jest.fn();
      const subscription = form.valueChanges.subscribe(spy);

      registerControl(field);

      expect(spy).not.toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should emit valueChanges on register', () => {
      const form = new FormGroup({});
      const field = {
        key: 'foo',
        form,
        formControl: new FormControl(),
        parent: { model: {} },
      };

      const spy = jest.fn();
      const subscription = form.valueChanges.subscribe(spy);

      registerControl(field, null, true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ foo: null });
      subscription.unsubscribe();
    });
  });
});

describe('unregisterControl', () => {
  it('FormArray', () => {
    const field = { key: '0', formControl: new FormControl() };
    const parent = new FormArray([new FormControl(), field.formControl]);

    unregisterControl(field);
    expect(field.formControl.parent).toBeNull();
    expect(parent.controls.length).toBe(1);
    expect(parent.controls[0]).not.toEqual(field.formControl);
  });

  it('FormGroup', () => {
    const field = { key: '0', formControl: new FormControl() };
    const parent = new FormGroup({ '0': field.formControl });

    unregisterControl(field);
    expect(parent.get('0')).toBeNull();
    expect(field.formControl.parent).toBeNull();
  });

  it('FormGroup control != field control', () => {
    const field = { key: '0', formControl: new FormControl() };
    const parent = new FormGroup({ '0': new FormControl() });

    unregisterControl(field);
    expect(parent.get('0')).not.toBeNull();
  });

  it('FormGroup with nested field key', () => {
    const field = { key: 'test.0', formControl: new FormControl() };
    const parent = new FormGroup({ test: new FormGroup({ '0': field.formControl }) });

    unregisterControl(field);
    expect(parent.get('test.0')).toBeNull();
    expect(field.formControl.parent).toBeNull();
  });
});
