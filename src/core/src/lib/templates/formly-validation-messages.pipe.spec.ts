import { AsyncPipe } from '@angular/common';
import { Component, Input, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { createBuilder, createComponent, createFieldComponent } from '@ngx-formly/core/testing';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { FieldArrayType, FormlyConfig, FormlyFieldConfig, FormlyValueChangeEvent } from '../core';
import { FormlyValidationMessageEntry, FormlyValidationMessagesPipe } from './formly-validation-messages.pipe';

function fieldWithErrors(errors: ValidationErrors = { required: true }, field: FormlyFieldConfig = {}) {
  const formControl = new FormControl();
  formControl.setErrors(errors);
  return { formControl, ...field };
}

describe('FormlyValidationMessagesPipe', () => {
  let config: FormlyConfig;
  let pipe: FormlyValidationMessagesPipe;
  let subscriptions: Subscription[];

  beforeEach(() => {
    config = new FormlyConfig();
    config.addConfig({ validationMessages: [{ name: 'required', message: 'Required' }] });
    pipe = new FormlyValidationMessagesPipe(config);
    subscriptions = [];
  });

  afterEach(() => subscriptions.forEach((subscription) => subscription.unsubscribe()));

  function watch(fields: Parameters<FormlyValidationMessagesPipe['transform']>[0]) {
    const next = jest.fn<void, [FormlyValidationMessageEntry[]]>();
    const subscription = pipe.transform(fields).subscribe(next);
    subscriptions.push(subscription);
    return {
      next,
      subscription,
      get entries() {
        return next.mock.calls[next.mock.calls.length - 1][0];
      },
    };
  }

  it.each([null, undefined, [], {}])('emits an empty array for %p', (fields) => {
    expect(watch(fields).entries).toEqual([]);
  });

  it('collects all own errors in field and error-key order, without traversing fieldArray templates', () => {
    const child = fieldWithErrors({ first: { message: 'First' }, second: { message: 'Second' } });
    const row = { fieldGroup: [child] };
    const group = fieldWithErrors({ group: { message: 'Group error' } }, { fieldGroup: [row] });
    const array = { fieldGroup: [group], fieldArray: fieldWithErrors() };
    const sibling = fieldWithErrors();
    const fields: readonly FormlyFieldConfig[] = [array, sibling];

    expect(watch(fields).entries).toEqual([
      { field: group, error: 'group', message: 'Group error' },
      { field: child, error: 'first', message: 'First' },
      { field: child, error: 'second', message: 'Second' },
      { field: sibling, error: 'required', message: 'Required' },
    ]);
  });

  it('does not turn a group invalidated by its children into an extra error', () => {
    const field: FormlyFieldConfig = { fieldGroup: [{ key: 'name', props: { required: true } }] };
    createBuilder().build(field);

    expect(field.formControl.invalid).toBe(true);
    expect(field.formControl.errors).toBeNull();
    expect(watch(field).entries).toEqual([{ field: field.fieldGroup[0], error: 'required', message: 'Required' }]);
  });

  it('omits hidden ancestors outside the supplied subtree and disabled controls', () => {
    const hiddenChild = fieldWithErrors({}, { parent: { hide: true }, resetOnHide: false });
    hiddenChild.formControl.setErrors({ required: true });
    const disabled = fieldWithErrors();
    disabled.formControl.disable();
    const child = fieldWithErrors();
    const hidden = fieldWithErrors({ required: true }, { hide: true, fieldGroup: [child] });
    child.parent = hidden;

    expect(watch([hiddenChild, disabled, hidden]).entries).toEqual([]);
  });

  it('collects errors regardless of touched, submitted, validation.show, or showError', () => {
    const field = fieldWithErrors(undefined, { validation: { show: false }, options: { showError: () => false } });

    expect(field.formControl.touched).toBe(false);
    expect(watch(field).entries).toEqual([{ field, error: 'required', message: 'Required' }]);
  });

  it('omits missing and empty messages without hiding subsequent errors', () => {
    const field = fieldWithErrors(
      { missing: true, empty: true, required: true },
      {
        validation: { messages: { empty: () => '' } },
      },
    );

    expect(watch(field).entries).toEqual([{ field, error: 'required', message: 'Required' }]);
  });

  it('lists shared-control errors at the first visible field that resolves a message', () => {
    const field = fieldWithErrors({ custom: true });
    const delayed = new Subject<string>();
    const first = { ...field, validation: { messages: { custom: () => delayed } } };
    const second = { ...field, validation: { messages: { custom: 'Fallback' } } };
    const hidden = { ...second, hide: true };
    const result = watch([hidden, field, first, second, second]);

    expect(result.entries).toEqual([{ field: second, error: 'custom', message: 'Fallback' }]);
    delayed.next('First');
    expect(result.entries).toEqual([{ field: first, error: 'custom', message: 'First' }]);
    delayed.next('');
    expect(result.entries).toEqual([{ field: second, error: 'custom', message: 'Fallback' }]);
  });

  it('skips forwarded errors at the source while collecting remaining and destination errors', () => {
    const destination = fieldWithErrors({ match: { message: 'Must match' } });
    const source = fieldWithErrors(
      { match: { errorPath: 'confirmation', message: 'Must match' }, required: true },
      { fieldGroup: [destination] },
    );

    expect(watch(source).entries).toEqual([
      { field: source, error: 'required', message: 'Required' },
      { field: destination, error: 'match', message: 'Must match' },
    ]);
  });

  it('preserves message precedence and passes the error value and field to functions', () => {
    const error = { message: 'Error object' };
    const message = jest.fn(() => of('Async validator'));
    const field = fieldWithErrors(
      { required: error },
      {
        validation: { messages: { required: 'Field' } },
        validators: { required: { message: 'Validator' } },
        asyncValidators: { required: { message } },
      },
    );
    const result = watch(field);

    expect(result.entries[0].message).toBe('Async validator');
    expect(message).toHaveBeenCalledTimes(1);
    expect(message).toHaveBeenCalledWith(error, field);
    delete field.asyncValidators.required;
    field.formControl.setErrors({ required: error });
    expect(result.entries[0].message).toBe('Validator');
    delete field.validators.required;
    field.formControl.setErrors({ required: error });
    expect(result.entries[0].message).toBe('Field');
    delete field.validation.messages.required;
    field.formControl.setErrors({ required: error });
    expect(result.entries[0].message).toBe('Error object');
    field.formControl.setErrors({ required: true });
    expect(result.entries[0].message).toBe('Required');
  });

  it('updates on the same control, including async validation and disable/enable', () => {
    const validation = new Subject<ValidationErrors>();
    const field = {
      formControl: new FormControl('', { validators: Validators.required, asyncValidators: () => validation }),
    };
    const result = watch(field);
    expect(result.entries[0].message).toBe('Required');

    field.formControl.setValue('name');
    expect(field.formControl.pending).toBe(true);
    expect(result.entries).toEqual([]);
    validation.next({ taken: { message: 'Already taken' } });
    validation.complete();
    expect(result.entries[0].message).toBe('Already taken');

    field.formControl.disable();
    expect(result.entries).toEqual([]);
    field.formControl.setValue('');
    field.formControl.enable();
    expect(result.entries[0].message).toBe('Required');
  });

  it('emits available messages immediately and cancels obsolete observable messages', () => {
    const translation = new Subject<string>();
    const field = fieldWithErrors(
      { translated: true, required: true },
      {
        validation: { messages: { translated: () => translation } },
      },
    );
    const result = watch(field);
    expect(result.entries.map(({ message }) => message)).toEqual(['Required']);

    translation.next('Translated');
    expect(result.entries.map(({ message }) => message)).toEqual(['Translated', 'Required']);
    translation.next('Updated translation');
    expect(result.entries[0].message).toBe('Updated translation');
    field.formControl.setErrors(null);
    expect(result.entries).toEqual([]);
    expect(translation.observers).toHaveLength(0);
    const calls = result.next.mock.calls.length;
    translation.next('Stale');
    expect(result.next).toHaveBeenCalledTimes(calls);
  });

  it.each(['props.required', 'templateOptions.required', 'validation.messages.required', 'props.label'])(
    'updates for %s expressions on the same field',
    (property) => {
      const fieldChanges = new Subject<FormlyValueChangeEvent>();
      const field = fieldWithErrors(undefined, {
        options: { fieldChanges },
        props: { label: 'Before' },
        validation: { messages: { required: (_error, field) => field.props.label } },
      });
      const result = watch(field);

      field.props.label = 'After';
      fieldChanges.next({ field, type: 'expressionChanges', property, value: 'After' });
      expect(result.entries[0].message).toBe('After');
      const calls = result.next.mock.calls.length;
      fieldChanges.next({ field: {}, type: 'expressionChanges', property, value: 'Unrelated' });
      expect(result.next).toHaveBeenCalledTimes(calls);
    },
  );

  it('retains resolved observable messages when a sibling changes', () => {
    const translation = new Subject<string>();
    const translated = fieldWithErrors(undefined, {
      validation: { messages: { required: () => translation } },
    });
    const sibling = fieldWithErrors();
    const root = {
      formControl: new FormGroup({ translated: translated.formControl, sibling: sibling.formControl }),
      fieldGroup: [translated, sibling],
    };
    translated.parent = root;
    sibling.parent = root;
    const result = watch(root);
    translation.next('Translated');

    sibling.formControl.setErrors(null);
    expect(result.entries).toEqual([{ field: translated, error: 'required', message: 'Translated' }]);
    translation.next('Updated translation');
    expect(result.entries[0].message).toBe('Updated translation');
  });

  it('updates when an ancestor outside the input hides or shows the field', () => {
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const parent = { hide: false, options: { fieldChanges } };
    const field = fieldWithErrors(undefined, { parent });
    const result = watch(field);

    parent.hide = true;
    fieldChanges.next({ field: parent, type: 'hidden', value: true });
    expect(result.entries).toEqual([]);
    parent.hide = false;
    fieldChanges.next({ field: parent, type: 'hidden', value: false });
    expect(result.entries[0].message).toBe('Required');
  });

  it('replaces control subscriptions after a field event without replacing the field', () => {
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const field = { formControl: new FormControl(''), options: { fieldChanges } };
    const original = field.formControl;
    const result = watch(field);

    field.formControl = new FormControl('', Validators.required);
    fieldChanges.next({ field, type: 'valueChanges', value: '' });
    expect(result.entries[0].message).toBe('Required');
    const calls = result.next.mock.calls.length;
    original.setErrors({ stale: { message: 'Stale' } });
    expect(result.next).toHaveBeenCalledTimes(calls);
    field.formControl.setValue('Valid');
    expect(result.entries).toEqual([]);
  });

  it('tracks real repeated-row additions and removals and detaches removed controls', () => {
    const { field, query } = createFieldComponent(
      {
        key: 'items',
        type: 'array',
        defaultValue: [{}],
        fieldArray: { fieldGroup: [{ key: 'name', props: { required: true } }] },
      },
      {
        declarations: [TestArrayType],
        config: { types: [{ name: 'array', component: TestArrayType }] },
      },
    );
    const array = query('formly-test-array').componentInstance as TestArrayType;
    const result = watch(field);
    expect(result.entries).toHaveLength(1);

    array.add();
    expect(result.entries).toHaveLength(2);
    const removed = field.fieldGroup[1].fieldGroup[0].formControl;
    array.remove(1);
    expect(result.entries).toHaveLength(1);
    const calls = result.next.mock.calls.length;
    removed.setErrors({ required: true });
    expect(result.next).toHaveBeenCalledTimes(calls);
  });

  it('tears down field, control, and message subscriptions when the consumer unsubscribes', () => {
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const message = new Subject<string>();
    const field = fieldWithErrors(undefined, {
      options: { fieldChanges },
      validation: { messages: { required: () => message } },
    });
    const result = watch(field);
    expect(fieldChanges.observers).toHaveLength(1);
    expect(message.observers).toHaveLength(1);

    result.subscription.unsubscribe();
    expect(fieldChanges.observers).toHaveLength(0);
    expect(message.observers).toHaveLength(0);
    expect((field.formControl.statusChanges as Subject<string>).observers).toHaveLength(0);
  });

  it.each(['observable', 'function'])('propagates %s message errors and releases its subscriptions', (source) => {
    const failure = new Error('Translation failed');
    const fieldChanges = new Subject<FormlyValueChangeEvent>();
    const field = fieldWithErrors(undefined, {
      options: { fieldChanges },
      validation: {
        messages: {
          required: () => {
            if (source === 'function') {
              throw failure;
            }
            return new Observable((subscriber) => subscriber.error(failure));
          },
        },
      },
    });
    const error = jest.fn();
    pipe.transform(field).subscribe({ error });

    expect(error).toHaveBeenCalledWith(failure);
    expect(fieldChanges.observers).toHaveLength(0);
  });

  it('renders through the FormlyModule export in an NgModule template', () => {
    const field = fieldWithErrors();
    const { query } = createComponent({
      inputs: { field },
      template: '<p>{{ (field | validationMessages | async)?.[0]?.message }}</p>',
      config: { validationMessages: [{ name: 'required', message: 'Required' }] },
    });

    expect(query('p').nativeElement.textContent).toBe('Required');
  });

  it('renders standalone without Zone.js and releases old inputs and destroyed views', async () => {
    TestBed.configureTestingModule({
      imports: [StandaloneHost],
      providers: [{ provide: FormlyConfig, useValue: config }, provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(StandaloneHost);
    const first = fieldWithErrors();
    fixture.componentRef.setInput('fields', [first]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent.trim()).toBe('Required');

    first.formControl.setErrors(null);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toBe('');

    const second = fieldWithErrors({ server: { message: 'Server error' } });
    fixture.componentRef.setInput('fields', [second]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent.trim()).toBe('Server error');
    expect((first.formControl.statusChanges as Subject<string>).observers).toHaveLength(0);
    fixture.destroy();
    expect((second.formControl.statusChanges as Subject<string>).observers).toHaveLength(0);
  });
});

@Component({ selector: 'formly-test-array', template: '', standalone: false })
class TestArrayType extends FieldArrayType {}

@Component({
  selector: 'formly-test-summary',
  imports: [AsyncPipe, FormlyValidationMessagesPipe],
  template: '@for (entry of fields | validationMessages | async; track $index) { {{ entry.message }} }',
})
class StandaloneHost {
  @Input() fields: FormlyFieldConfig[];
}
