import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { createBuilder } from '@ngx-formly/core/testing';
import { Subject } from 'rxjs';
import { MockInstance } from 'vitest';
import { FormlyFieldConfigCache, FormlyValueChangeEvent } from '../../models';

function build(root: FormlyFieldConfigCache) {
  const builder = createBuilder({ extensions: ['core', 'validation', 'form', 'expression'] });
  builder.build(root);
  return root;
}

const exprEvents = (spy: MockInstance) =>
  spy.mock.calls.map(([e]) => e as FormlyValueChangeEvent).filter((e) => e.type === 'expressionChanges');

describe('FieldExpressionExtension rebuilds with disabled and cascadeDisabled', () => {
  it('should not repeat a disabled expression when a supplied SignalFormControl stays enabled', () => {
    const name = TestBed.runInInjectionContext(() => new SignalFormControl('Ada'));
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const spy = vi.fn();
    fieldChanges.subscribe(spy);
    const field: FormlyFieldConfigCache = { key: 'name', expressions: { 'props.disabled': () => true } };
    const root = build({
      model: { name: 'Ada' },
      form: new FormGroup({ name }),
      options: { fieldChanges },
      fieldGroup: [field],
    });
    expect(field.props.disabled).toBe(true);
    expect(name.enabled).toBe(true);
    spy.mockClear();

    root.options.build();
    root.options.checkExpressions(root);
    expect(exprEvents(spy)).toHaveLength(0);
  });

  it('should not repeat expressionChanges for a truthy non-boolean disabled expression', () => {
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const spy = vi.fn();
    fieldChanges.subscribe(spy);
    const field: FormlyFieldConfigCache = {
      key: 'a',
      expressions: { 'props.disabled': () => 1 as unknown as boolean },
    };
    const root = build({ model: {}, options: { fieldChanges }, fieldGroup: [field] });
    spy.mockReset();

    root.options.build();
    root.options.build();
    root.options.checkExpressions(root);
    expect(exprEvents(spy)).toHaveLength(0);
  });

  it('keyed group with cascadeDisabled=false keeps children enabled across rebuilds, no emission', () => {
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const spy = vi.fn();
    fieldChanges.subscribe(spy);
    const child: FormlyFieldConfigCache = { key: 'c' };
    const group: FormlyFieldConfigCache = {
      key: 'g',
      cascadeDisabled: false,
      expressions: { 'props.disabled': () => true },
      fieldGroup: [child],
    } as FormlyFieldConfigCache;
    const root = build({ model: {}, options: { fieldChanges }, fieldGroup: [group] });
    expect(child.formControl.enabled).toBe(true);
    spy.mockReset();

    root.options.build();
    root.options.build();
    expect(child.formControl.enabled).toBe(true);
    expect(child.props.disabled).toBeFalsy();
    expect(exprEvents(spy)).toHaveLength(0);
  });

  it('re-enabling via form.enable() is corrected and reported on rebuild', () => {
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const spy = vi.fn();
    fieldChanges.subscribe(spy);
    const child: FormlyFieldConfigCache = { key: 'c' };
    const group: FormlyFieldConfigCache = {
      key: 'g',
      expressions: { 'props.disabled': () => true },
      fieldGroup: [child],
    };
    const root = build({ model: {}, options: { fieldChanges }, fieldGroup: [group] });
    expect(child.formControl.disabled).toBe(true);
    spy.mockReset();

    root.form.enable();
    root.options.build();
    expect(child.formControl.disabled).toBe(true);
    // The field-form rebuild re-disables the control before expressions run, so no drift is seen.
    expect(exprEvents(spy)).toHaveLength(0);
  });

  it('child with own disabled=false expression inside a disabled parent stays disabled after rebuild', () => {
    const child: FormlyFieldConfigCache = { key: 'c', expressions: { 'props.disabled': () => false } };
    const group: FormlyFieldConfigCache = {
      key: 'g',
      expressions: { 'props.disabled': () => true },
      fieldGroup: [child],
    };
    const root = build({
      model: {},
      options: { fieldChanges: new Subject<FormlyValueChangeEvent>() },
      fieldGroup: [group],
    });
    root.options.build();
    expect(child.props.disabled).toBe(true);
    expect(child.formControl.disabled).toBe(true);
  });

  it('rebuild after disabled expression flips false re-enables the children', () => {
    let lock = true;
    const child: FormlyFieldConfigCache = { key: 'c' };
    const group: FormlyFieldConfigCache = {
      key: 'g',
      expressions: { 'props.disabled': () => lock },
      fieldGroup: [child],
    };
    const root = build({
      model: {},
      options: { fieldChanges: new Subject<FormlyValueChangeEvent>() },
      fieldGroup: [group],
    });
    expect(child.formControl.disabled).toBe(true);
    lock = false;
    root.options.build();
    expect(child.props.disabled).toBe(false);
    expect(child.formControl.enabled).toBe(true);
  });

  it('hidden field with disabled expression keeps state after unhide via rebuild', () => {
    let hide = true;
    const field: FormlyFieldConfigCache = {
      key: 'a',
      expressions: { hide: () => hide, 'props.disabled': () => true },
    };
    const root = build({
      model: {},
      options: { fieldChanges: new Subject<FormlyValueChangeEvent>() },
      fieldGroup: [field],
    });
    hide = false;
    root.options.build();
    expect(root.form.get('a')).toBeTruthy();
    expect(field.formControl.disabled).toBe(true);
  });
});
