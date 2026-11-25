import { Component, effect, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormResetEvent,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs/operators';
import { FormlySignalFormControl } from './signal-form-control';
import { updateValidity } from './utils';

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
      control.updateValueAndValidity();

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
      control.updateValueAndValidity();

      control.setValidators(null);
      expect(control.validator).toBeNull();
      expect(control.hasError('min')).toBe(true);
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();
    });

    it('should rerun validators that read other state on updateValueAndValidity()', () => {
      const control = createControl(10);
      let min = 18;
      control.setValidators((c) => (c.value < min ? { min: true } : null));
      control.updateValueAndValidity();
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
      control.updateValueAndValidity();
      expect(control.errors).toEqual({ min: { min: 18, actual: 10 } });

      control.removeValidators(min);
      expect(control.hasValidator(min)).toBe(false);
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();

      control.setValidators(min);
      control.updateValueAndValidity();
      control.clearValidators();
      expect(control.validator).toBeNull();
      control.updateValueAndValidity();
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

    it('should drop the pending dirty and touched states on markAsPristine() and markAsUntouched()', () => {
      const { control, root } = createHost('submit');

      type(root, 'Bob').dispatchEvent(new Event('blur'));
      control.markAsPristine();
      control.markAsUntouched();
      root.querySelector('form').dispatchEvent(new Event('submit'));

      expect(control.value).toEqual('Bob');
      expect(control.dirty).toBe(false);
      expect(control.touched).toBe(false);
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
      it('should allow silent validator updates inside a parent valueChanges listener', () => {
        const name = signalForms ? createControl('') : new FormControl('');
        const kind = new FormControl('draft');
        const form = new FormGroup({ kind, name });
        TestBed.tick();
        const updateRequired = vi.fn(() => {
          name.setValidators(kind.value === 'final' ? Validators.required : null);
          name.updateValueAndValidity({ emitEvent: false });
        });
        // Bound the listener so a recursive emission fails the assertion instead of overflowing the stack.
        form.valueChanges.pipe(take(2)).subscribe(updateRequired);

        kind.setValue('final');
        TestBed.tick();
        expect(updateRequired).toHaveBeenCalledTimes(1);
        expect(name.errors).toEqual({ required: true });
        expect(form.invalid).toBe(true);
      });

      it('should preserve edits until the source of a synchronization effect changes', () => {
        const control = build(signalForms);
        const recordName = signal('Alice');
        TestBed.runInInjectionContext(() => effect(() => control.setValue(recordName(), { emitEvent: false })));
        TestBed.tick();

        control.setValue('Bob');
        TestBed.tick();
        expect(control.parent.value).toEqual({ name: 'Bob' });

        recordName.set('Carol');
        TestBed.tick();
        expect(control.parent.value).toEqual({ name: 'Carol' });
      });

      it('should not restore manual errors when the value comes back', () => {
        const control = build(signalForms);
        control.setErrors({ server: true });
        expect(control.errors).toEqual({ server: true });

        control.setValue('Bob');
        expect(control.errors).toBeNull();

        control.setValue('Alice');
        expect(control.errors).toBeNull();
      });

      it('should revalidate and emit an array that was mutated in place', () => {
        const control = build(signalForms);
        control.setValue(['tag']);
        control.setValidators(Validators.required);
        control.updateValueAndValidity();
        TestBed.tick();
        const values: unknown[] = [];
        control.valueChanges.subscribe((value) => values.push(value));

        const tags = control.value as unknown as string[];
        tags.pop();
        control.patchValue(tags as never);
        TestBed.tick();

        expect(control.errors).toEqual({ required: true });
        expect(control.parent.invalid).toBe(true);
        expect(values).toEqual([[]]);
      });

      it.each([undefined, false])('should emit the value once, during setValue({ emitEvent: %s })', (emitEvent) => {
        const control = build(signalForms);
        const events: unknown[] = [];
        control.valueChanges.subscribe((value) => events.push(value));
        control.parent.valueChanges.subscribe((value) => events.push(value));
        const expected = emitEvent === false ? [] : ['Bob', { name: 'Bob' }];

        control.setValue('Bob', { emitEvent });
        expect(events).toEqual(expected);
        TestBed.tick();
        expect(events).toEqual(expected);
      });

      it('should not emit the initial value', () => {
        const control = signalForms ? createControl('Alice') : new FormControl('Alice');
        const values: unknown[] = [];
        control.valueChanges.subscribe((value) => values.push(value));
        TestBed.tick();

        expect(values).toEqual([]);
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

      it('should keep the errors set on the parent when the control sets and clears its errors', () => {
        const control = build(signalForms);
        control.parent.setErrors({ server: true });

        control.setErrors({ required: true });
        TestBed.tick();
        expect(control.parent.errors).toEqual({ server: true });

        control.setErrors(null);
        TestBed.tick();
        expect(control.parent.errors).toEqual({ server: true });
        expect(control.parent.invalid).toBe(true);
      });

      describe.each([false, true])('signal sibling=%s', (signalSibling) => {
        // The control sits in a nested group, so the root checks propagation to the grandparent.
        function buildWithSibling() {
          const control = signalForms ? createControl('Alice') : new FormControl('Alice');
          const sibling = signalSibling ? createControl('') : new FormControl('');
          const root = new FormGroup({ nested: new FormGroup({ name: control, sibling }) });
          TestBed.tick();
          sibling.markAsDirty();
          sibling.markAsTouched();
          control.markAsDirty();
          control.markAsTouched();
          TestBed.tick();

          return { control, sibling, root };
        }

        it.each(['reset', 'markAsPristine', 'markAsUntouched'] as const)(
          'should keep the sibling state on %s()',
          (method) => {
            const { control, sibling, root } = buildWithSibling();

            control[method]();
            TestBed.tick();

            expect(sibling.dirty).toBe(true);
            expect(sibling.touched).toBe(true);
            expect(root.dirty).toBe(true);
            expect(root.touched).toBe(true);
          },
        );

        it('should update the ancestors once the sibling is reset too', () => {
          const { control, sibling, root } = buildWithSibling();

          control.reset();
          sibling.reset();
          TestBed.tick();

          expect(control.parent.pristine).toBe(true);
          expect(control.parent.untouched).toBe(true);
          expect(root.pristine).toBe(true);
          expect(root.untouched).toBe(true);
        });

        it('should keep the sibling state when the control is added to a group', () => {
          const sibling = signalSibling ? createControl('') : new FormControl('');
          const group = new FormGroup<Record<string, AbstractControl>>({ sibling });
          sibling.markAsDirty();
          sibling.markAsTouched();
          TestBed.tick();

          group.addControl('name', signalForms ? createControl('Alice') : new FormControl('Alice'));
          TestBed.tick();

          expect(sibling.dirty).toBe(true);
          expect(sibling.touched).toBe(true);
          expect(group.dirty).toBe(true);
          expect(group.touched).toBe(true);
        });
      });

      it.each(['markAsDirty', 'markAsTouched'] as const)(
        'should not update the parent on %s({ onlySelf: true })',
        (method) => {
          const control = build(signalForms);

          control[method]({ onlySelf: true });
          TestBed.tick();

          expect(control[method === 'markAsDirty' ? 'dirty' : 'touched']).toBe(true);
          expect(control.parent[method === 'markAsDirty' ? 'dirty' : 'touched']).toBe(false);
        },
      );

      it('should keep the parent state on reset({ onlySelf: true }), as FormGroup.reset() then updates it', () => {
        const control = build(signalForms);
        control.markAsDirty();
        control.markAsTouched();
        TestBed.tick();

        control.reset(undefined, { onlySelf: true });
        TestBed.tick();

        expect(control.pristine).toBe(true);
        expect(control.parent.dirty).toBe(true);
        expect(control.parent.touched).toBe(true);
      });

      it('should reset the whole form', () => {
        const control = build(signalForms);
        const sibling = createControl('');
        (control.parent as FormGroup).addControl('sibling', sibling);
        control.markAsDirty();
        sibling.markAsTouched();
        TestBed.tick();

        control.parent.reset();
        TestBed.tick();

        expect([control.dirty, control.touched, sibling.dirty, sibling.touched]).toEqual([false, false, false, false]);
        expect(control.parent.pristine).toBe(true);
        expect(control.parent.untouched).toBe(true);
      });

      it('should not emit on updateValueAndValidity({ emitEvent: false })', () => {
        const control = build(signalForms);
        let invalid = false;
        control.setValidators(() => (invalid ? { invalid: true } : null));
        control.updateValueAndValidity();
        TestBed.tick();
        const events: unknown[] = [];
        control.valueChanges.subscribe((value) => events.push(value));
        control.statusChanges.subscribe((status) => events.push(status));
        control.parent.valueChanges.subscribe((value) => events.push(value));
        control.parent.statusChanges.subscribe((status) => events.push(status));

        invalid = true;
        control.updateValueAndValidity({ emitEvent: false });
        expect(control.parent.invalid).toBe(true);
        TestBed.tick();

        expect(events).toEqual([]);
      });

      it('should not update the parent on updateValueAndValidity({ onlySelf: true })', () => {
        const control = build(signalForms);
        let invalid = false;
        control.setValidators(() => (invalid ? { invalid: true } : null));
        control.updateValueAndValidity();
        TestBed.tick();

        invalid = true;
        control.updateValueAndValidity({ onlySelf: true });
        TestBed.tick();

        expect(control.invalid).toBe(true);
        expect(control.parent.valid).toBe(true);
      });

      // Formly revalidates silently, then emits the status of the control only.
      it.each([false, true])('should emit only the control status on updateValidity(onlySelf=%s)', (onlySelf) => {
        const control = build(signalForms);
        let invalid = false;
        control.setValidators(() => (invalid ? { invalid: true } : null));
        control.updateValueAndValidity();
        TestBed.tick();
        const events: unknown[] = [];
        control.statusChanges.subscribe((status) => events.push(`control:${status}`));
        control.parent.statusChanges.subscribe((status) => events.push(`parent:${status}`));

        invalid = true;
        updateValidity(control, onlySelf);
        TestBed.tick();

        expect(events).toEqual(['control:INVALID']);
        expect(control.parent.invalid).toBe(!onlySelf);
      });

      it.each([undefined, false])('should emit the statuses once on setValue({ emitEvent: %s })', (emitEvent) => {
        const control = build(signalForms);
        control.setValidators(Validators.required);
        control.updateValueAndValidity();
        TestBed.tick();
        const events: unknown[] = [];
        control.statusChanges.subscribe((status) => events.push(`control:${status}`));
        control.parent.statusChanges.subscribe((status) => events.push(`parent:${status}`));

        control.setValue('', { emitEvent });
        TestBed.tick();

        expect(control.parent.invalid).toBe(true);
        expect(events).toEqual(
          emitEvent === false
            ? []
            : signalForms
              ? ['parent:INVALID', 'control:INVALID']
              : ['control:INVALID', 'parent:INVALID'],
        );
      });

      // Signal form controls emit once per tick: the last emitted status must still match the current one.
      function trackLastStatus(control: AbstractControl) {
        const last: { control?: string; parent?: string } = {};
        control.statusChanges.subscribe((status) => (last.control = status));
        control.parent.statusChanges.subscribe((status) => (last.parent = status));

        return last;
      }

      it('should emit the status of a value normalized with emitEvent: false by a valueChanges subscriber', () => {
        const control = build(signalForms);
        control.setValidators((c) => (c.value === 'BAD' ? { bad: true } : null));
        control.updateValueAndValidity();
        TestBed.tick();
        control.valueChanges.subscribe((value: string) => control.setValue(value.toUpperCase(), { emitEvent: false }));
        const last = trackLastStatus(control);

        control.setValue('bad');
        TestBed.tick();

        expect(control.status).toEqual('INVALID');
        expect(last).toEqual({ control: 'INVALID', parent: 'INVALID' });
      });

      it('should still emit a status change followed by a setValue({ emitEvent: false })', () => {
        const control = build(signalForms);
        let invalid = false;
        control.setValidators(() => (invalid ? { invalid: true } : null));
        control.updateValueAndValidity();
        TestBed.tick();
        const last = trackLastStatus(control);

        invalid = true;
        control.updateValueAndValidity();
        control.setValue('Bob', { emitEvent: false });
        TestBed.tick();

        expect(control.status).toEqual('INVALID');
        expect(last).toEqual({ control: 'INVALID', parent: 'INVALID' });
      });

      it('should set the control as the source of the parent events on updateValueAndValidity()', () => {
        const control = build(signalForms);
        const sources: unknown[] = [];
        control.parent.events.subscribe((event) => sources.push(event.source));

        control.updateValueAndValidity();

        expect(sources.length).toBeGreaterThan(0);
        expect(sources.every((source) => source === control)).toBe(true);
      });
    });
  });

  it('should emit a value written to the field tree when the effects run', () => {
    const control = createControl('Alice');
    const group = new FormGroup({ name: control });
    TestBed.tick();
    const values: unknown[] = [];
    control.valueChanges.subscribe((value) => values.push(value));

    control.setValue('Bob');
    control.fieldTree().value.set('Carol');
    TestBed.tick();

    expect(values).toEqual(['Bob', 'Carol']);
    expect(group.value).toEqual({ name: 'Carol' });
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
