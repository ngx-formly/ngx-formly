import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
