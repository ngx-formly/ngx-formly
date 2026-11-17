import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormResetEvent, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormlySignalFormControl } from './signal-form-control';

function createControl(value: unknown, isDisabled = false): FormlySignalFormControl {
  return TestBed.runInInjectionContext(() => new FormlySignalFormControl(value, isDisabled, () => {}));
}

describe('FormlySignalFormControl', () => {
  describe('disable() and enable()', () => {
    it('should toggle the disabled state instead of throwing', () => {
      const control = createControl('foo');

      control.disable();
      expect(control.disabled).toBe(true);
      expect(control.status).toEqual('DISABLED');

      control.enable();
      expect(control.disabled).toBe(false);
    });

    it('should start disabled when requested', () => {
      expect(createControl('foo', true).disabled).toBe(true);
    });

    it('should be disabled and enabled through its parent group', () => {
      const control = createControl('foo');
      const group = new FormGroup({ name: control, age: new FormControl(25) });

      group.disable();
      expect(control.disabled).toBe(true);

      group.enable();
      expect(control.disabled).toBe(false);
    });
  });

  describe('setValidators()', () => {
    it('should report the same errors as a FormControl', () => {
      const control = createControl(10);
      const classic = new FormControl(10, Validators.min(18));

      control.setValidators(Validators.min(18));

      expect(control.errors).toEqual(classic.errors);
      expect(control.errors).toEqual({ min: { min: 18, actual: 10 } });
      expect(control.status).toEqual('INVALID');
    });

    it('should revalidate when the value changes', () => {
      const control = createControl(10);
      control.setValidators([Validators.required, Validators.min(18)]);

      control.setValue(20);
      expect(control.errors).toBeNull();

      control.setValue(null);
      expect(control.errors).toEqual({ required: true });
    });

    it('should clear the errors when validators are removed', () => {
      const control = createControl(10);
      control.setValidators(Validators.min(18));

      control.setValidators(null);

      expect(control.validator).toBeNull();
      expect(control.errors).toBeNull();
    });

    it('should rerun validators that read other state on updateValueAndValidity()', () => {
      const control = createControl(10);
      let min = 18;
      control.setValidators((c) => (c.value < min ? { min: true } : null));
      expect(control.hasError('min')).toBe(true);

      min = 5;
      expect(control.hasError('min')).toBe(true);

      control.updateValueAndValidity();
      expect(control.hasError('min')).toBe(false);
    });
  });

  describe('reset()', () => {
    it('should preserve reset events unless suppressed', () => {
      const control = createControl('Alice');
      const resets: FormResetEvent[] = [];
      control.events.subscribe((event) => {
        if (event instanceof FormResetEvent) {
          resets.push(event);
        }
      });

      control.reset('Bob');
      expect(resets).toHaveLength(1);
      expect(resets[0].source).toBe(control);

      control.reset('Carol', { emitEvent: false });
      TestBed.tick();
      expect(resets).toHaveLength(1);
    });

    it('should accept the { value, disabled } form like a FormControl', () => {
      const control = createControl('foo');
      control.markAsTouched();
      control.markAsDirty();

      control.reset({ value: 'bar', disabled: true });

      expect(control.value).toEqual('bar');
      expect(control.disabled).toBe(true);
      expect(control.touched).toBe(false);
      expect(control.dirty).toBe(false);
    });

    it('should reset to undefined when the state value is undefined', () => {
      const control = createControl('foo');
      const classic = new FormControl('foo');

      control.reset({ value: undefined, disabled: false });
      classic.reset({ value: undefined, disabled: false });

      expect(control.value).toEqual(classic.value);
      expect(control.value).toBeUndefined();
    });

    it('should keep resetting to the initial value without arguments', () => {
      const control = createControl('foo');
      control.setValue('bar');

      control.reset();

      expect(control.value).toEqual('foo');
    });

    it('should clear the value without arguments when there is no initial value', () => {
      const control = createControl(undefined);
      control.setValue([2]);

      control.reset();

      expect(control.value).toBeUndefined();
    });
  });

  describe('addValidators(), removeValidators() and clearValidators()', () => {
    it('should behave like a FormControl', () => {
      const control = createControl(10);
      const min = Validators.min(18);

      control.addValidators(min);
      expect(control.hasValidator(min)).toBe(true);
      expect(control.errors).toEqual({ min: { min: 18, actual: 10 } });

      control.removeValidators(min);
      expect(control.hasValidator(min)).toBe(false);
      expect(control.errors).toBeNull();

      control.setValidators(min);
      control.clearValidators();
      expect(control.validator).toBeNull();
      expect(control.errors).toBeNull();
    });

    it('should accept removing and clearing async validators and reject adding one', () => {
      const control = createControl('foo');
      const asyncValidator = async (): Promise<null> => null;

      expect(() => control.removeAsyncValidators(asyncValidator)).not.toThrow();
      expect(() => control.clearAsyncValidators()).not.toThrow();
      expect(() => control.addAsyncValidators(asyncValidator)).toThrow(
        '[Formly Error] Async validators are not supported on a signal form control.',
      );
    });
  });

  describe('setErrors()', () => {
    it.each(['set', 'update'] as const)('should discard manual errors after field-tree value.%s()', (method) => {
      const control = createControl('Alice');
      control.setErrors({ server: true });
      expect(control.errors).toEqual({ server: true });
      const value = control.fieldTree().value;

      if (method === 'set') {
        value.set('Bob');
      } else {
        value.update(() => 'Bob');
      }
      expect(control.errors).toBeNull();

      value.set('Alice');
      expect(control.errors).toBeNull();
    });

    it('should report the same errors as a FormControl', () => {
      const control = createControl('foo');
      const classic = new FormControl('foo');

      control.setErrors({ server: { message: 'taken' } });
      classic.setErrors({ server: { message: 'taken' } });

      expect(control.errors).toEqual(classic.errors);
      expect(control.status).toEqual('INVALID');

      control.setErrors(null);
      expect(control.errors).toBeNull();
      expect(control.status).toEqual('VALID');
    });

    it('should replace the validator errors until the next validation run', () => {
      const control = createControl(10);
      control.setValidators(Validators.min(18));

      control.setErrors({ server: true });
      expect(control.errors).toEqual({ server: true });

      control.updateValueAndValidity();
      expect(control.errors).toEqual({ min: { min: 18, actual: 10 } });
    });

    it('should drop the errors when the value changes', () => {
      const control = createControl('foo');
      control.setErrors({ server: true });

      control.setValue('bar');

      expect(control.errors).toBeNull();
    });
  });

  describe('updateOn', () => {
    function createHost(updateOn: 'blur' | 'submit'): { control: FormlySignalFormControl; root: HTMLElement } {
      @Component({
        template: `<form [formGroup]="form"><input formControlName="name" /></form>`,
        imports: [ReactiveFormsModule],
      })
      class HostComponent {
        control = new FormlySignalFormControl('Alice', false, () => {}, undefined, updateOn);
        form = new FormGroup({ name: this.control });
      }
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      return { control: fixture.componentInstance.control, root: fixture.nativeElement };
    }

    function type(root: HTMLElement, value: string): HTMLInputElement {
      const input = root.querySelector('input');
      input.value = value;
      input.dispatchEvent(new Event('input'));

      return input;
    }

    it('should default to change, like a FormControl', () => {
      expect(createControl('foo').updateOn).toEqual('change');
    });

    it('should hold the typed value until blur', () => {
      const { control, root } = createHost('blur');

      const input = type(root, 'Bob');
      expect(control.value).toEqual('Alice');
      expect(control.dirty).toBe(false);

      input.dispatchEvent(new Event('blur'));
      expect(control.value).toEqual('Bob');
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it('should hold the typed value until submit', () => {
      const { control, root } = createHost('submit');

      const input = type(root, 'Bob');
      input.dispatchEvent(new Event('blur'));
      expect(control.value).toEqual('Alice');
      expect(control.touched).toBe(false);

      root.querySelector('form').dispatchEvent(new Event('submit'));
      expect(control.value).toEqual('Bob');
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it.each([
      ['blur', 'reset'],
      ['blur', 'setValue'],
      ['submit', 'reset'],
      ['submit', 'setValue'],
    ] as const)('should discard the pending %s input on %s()', (updateOn, method) => {
      const { control, root } = createHost(updateOn);

      const input = type(root, 'Bob');
      control[method]('Carol');
      input.dispatchEvent(new Event('blur'));
      root.querySelector('form').dispatchEvent(new Event('submit'));

      expect(control.value).toEqual('Carol');
      expect(control.dirty).toBe(method === 'setValue');
    });
  });

  describe('Reactive Forms compatibility', () => {
    // Same sequences on a FormControl (false) and on the signal control (true).
    function build(signalForms: boolean): FormControl | FormlySignalFormControl {
      const control = signalForms ? createControl('Alice') : new FormControl('Alice');
      new FormGroup({ name: control });
      TestBed.tick();

      return control;
    }

    describe.each([false, true])('signalForms=%s', (signalForms) => {
      it('should not restore manual errors when the value comes back', () => {
        const control = build(signalForms);
        control.setErrors({ server: true });
        expect(control.errors).toEqual({ server: true });

        control.setValue('Bob');
        expect(control.errors).toBeNull();

        control.setValue('Alice');
        expect(control.errors).toBeNull();
      });

      it('should drop manual errors on reset', () => {
        const control = build(signalForms);
        control.setErrors({ server: true });

        control.reset('Alice');
        TestBed.tick();

        expect(control.errors).toBeNull();
      });

      it.each(['disable', 'enable'] as const)('should not emit on %s({ emitEvent: false })', (method) => {
        const control = build(signalForms);
        control[method === 'disable' ? 'enable' : 'disable']();
        TestBed.tick();
        const events: unknown[] = [];
        control.valueChanges.subscribe((value) => events.push(value));
        control.statusChanges.subscribe((status) => events.push(status));
        control.parent.valueChanges.subscribe((value) => events.push(value));
        control.parent.statusChanges.subscribe((status) => events.push(status));

        control[method]({ emitEvent: false });
        expect(control.parent.disabled).toBe(method === 'disable');
        TestBed.tick();

        expect(events).toEqual([]);
      });

      it('should emit again after a suppressed toggle was reverted', () => {
        const control = build(signalForms);
        control.disable({ emitEvent: false });
        control.enable({ emitEvent: false });
        TestBed.tick();
        const events: unknown[] = [];
        control.statusChanges.subscribe((status) => events.push(status));

        control.disable();
        TestBed.tick();

        expect(events).toEqual(['DISABLED']);
      });

      it('should update the parent validity synchronously on setErrors()', () => {
        const control = build(signalForms);
        expect(control.parent.valid).toBe(true);

        control.setErrors({ server: true });
        expect(control.parent.invalid).toBe(true);

        control.setErrors(null);
        expect(control.parent.valid).toBe(true);
      });
    });
  });

  describe('setAsyncValidators()', () => {
    it('should accept clearing and reject actual async validators', () => {
      const control = createControl('foo');

      expect(() => control.setAsyncValidators(null)).not.toThrow();
      expect(() => control.setAsyncValidators(async () => null)).toThrow(
        '[Formly Error] Async validators are not supported on a signal form control.',
      );
    });
  });

  // FormControlDirective calls setValidators() when the element has a validator directive.
  it('should work with [formControl] and a validator directive', () => {
    @Component({
      template: `<input [formControl]="control" required />`,
      imports: [ReactiveFormsModule],
    })
    class HostComponent {
      control = createControl('');
    }

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const { control } = fixture.componentInstance;
    expect(control.errors).toEqual({ required: true });

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'foo';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(control.value).toEqual('foo');
    expect(control.errors).toBeNull();
  });
});
