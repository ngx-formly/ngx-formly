import { createFieldComponent } from '@ngx-formly/core/testing';
import {
  FormlyModule,
  FormlyFieldConfig,
  FormlyConfig,
  FormlyValidationMessage,
  LegacyFormlyValidationMessage,
} from '../core';
import { of, Subject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

function validationMessageContent(query: (v: string) => DebugElement): string {
  return query('formly-validation-message').nativeElement.textContent;
}

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    template: '<formly-validation-message [field]="field"></formly-validation-message>',
    imports: [
      FormlyModule.forChild({
        validationMessages: [
          { name: 'required', message: (err, field) => `${field.props.label} is required.` },
          { name: 'maxLength', message: 'Maximum Length Exceeded.' },
          { name: 'minLength', message: () => of('Minimum Length.') },
        ],
      }),
    ],
  });
};

describe('FormlyValidationMessage Component', () => {
  it('should not display message error when form is valid', () => {
    const { query } = renderComponent({ key: 'title' });

    expect(validationMessageContent(query)).toEqual('');
  });

  describe('display message error when form is invalid', () => {
    it('with a string validation message', () => {
      const { query } = renderComponent({
        key: 'title',
        defaultValue: '1234567',
        props: { maxLength: 3 },
      });
      expect(validationMessageContent(query)).toEqual('Maximum Length Exceeded.');
    });

    it('with a function validation message', () => {
      const { query, detectChanges } = renderComponent({
        key: 'title',
        props: {
          required: true,
          label: 'Title',
        },
      });
      detectChanges();
      expect(validationMessageContent(query)).toEqual('Title is required.');
    });

    it('with an observable validation message', () => {
      const { query, detectChanges } = renderComponent({
        key: 'title',
        defaultValue: '1',
        props: { minLength: 5 },
      });
      detectChanges();
      expect(validationMessageContent(query)).toEqual('Minimum Length.');
    });

    it.each([() => false, 'false'])('with a `validator.message` property and expression %p', (expression) => {
      const { query } = renderComponent({
        key: 'title',
        validators: {
          required: {
            expression,
            message: 'Custom error message.',
          },
        },
      });

      expect(validationMessageContent(query)).toEqual('Custom error message.');
    });

    it('should handle expressions changes', () => {
      const { query } = renderComponent({
        key: 'title',
        validators: {
          required: {
            expression: () => false,
            message: 'Custom error message.',
          },
        },
      });

      expect(validationMessageContent(query)).toEqual('Custom error message.');
    });

    it('should handle expressions changes', () => {
      const { query, field, detectChanges } = renderComponent({
        key: 'title',
        options: { fieldChanges: new Subject<any>() },
        validators: {
          required: {
            expression: () => false,
            message: 'Custom error message.',
          },
        },
      });

      // without emit expressionChanges
      field.validation.messages.required = 'edited required message';
      detectChanges();
      expect(validationMessageContent(query)).not.toMatch(/edited required message/);

      // emit expressionChanges from a different field
      field.options.fieldChanges.next({
        type: 'expressionChanges',
        property: 'validation.messages.required',
        field: field.parent,
        value: 'edit required message',
      });
      expect(validationMessageContent(query)).not.toMatch(/edited required message/);

      // emit expressionChanges from component field
      field.options.fieldChanges.next({
        type: 'expressionChanges',
        property: 'validation.messages.required',
        field: field,
        value: 'edit required message',
      });
      expect(validationMessageContent(query)).not.toMatch(/edited required message/);
    });
  });
});

describe.each([FormlyValidationMessage, LegacyFormlyValidationMessage])('%s compatibility', (MessageComponent) => {
  it('keeps the getter and stream limited to the first error by default', () => {
    const config = new FormlyConfig();
    config.addValidatorMessage('required', 'Required');
    const component = new MessageComponent(config);
    component.field = { formControl: new FormControl() };
    component.field.formControl.setErrors({ required: true, other: { message: 'Other' } });
    expect(component.errorMessage).toBe('Required');
    component.ngOnChanges();
    const next = vi.fn();
    const subscription = component.errorMessage$.subscribe(next);
    expect(next).toHaveBeenLastCalledWith('Required');

    component.field.formControl.setErrors({ missing: true, required: true });
    expect(component.errorMessage).toBeUndefined();
    expect(next).toHaveBeenLastCalledWith(undefined);
    component.field.formControl.setErrors({ forwarded: { errorPath: 'child' }, required: true });
    expect(component.errorMessage).toBeUndefined();
    expect(next).toHaveBeenLastCalledWith(undefined);
    subscription.unsubscribe();
  });

  it('preserves observable getter values used by custom wrappers', () => {
    const config = new FormlyConfig();
    const translation = new Subject<string>();
    config.addValidatorMessage('required', () => translation);
    const component = new MessageComponent(config);
    component.field = { formControl: new FormControl() };
    component.field.formControl.setErrors({ required: true });

    expect(component.errorMessage).toBe(translation);
  });
});

describe.each([
  { name: 'standalone', MessageComponent: FormlyValidationMessage },
  { name: 'NgModule', MessageComponent: LegacyFormlyValidationMessage },
])('$name multiple messages', ({ MessageComponent }) => {
  function renderMessages(showAllErrors?: boolean) {
    TestBed.configureTestingModule({
      imports: [FormlyModule.forRoot()],
    });
    TestBed.inject(FormlyConfig).addValidatorMessage('first', 'First error.');
    const fixture = TestBed.createComponent(MessageComponent);
    const field: FormlyFieldConfig = {
      formControl: new FormControl(),
      validation: { showAllErrors },
      options: { fieldChanges: new Subject() },
    };
    field.formControl.setErrors({ first: true, second: { message: 'Second error.' } });
    fixture.componentRef.setInput('field', field);
    fixture.detectChanges();
    return { fixture, field, content: () => fixture.nativeElement.textContent };
  }

  it.each([undefined, false])('keeps first-error behavior when showAllErrors is %p', (showAllErrors) => {
    const { fixture, field, content } = renderMessages(showAllErrors);
    expect(content()).toBe('First error.');
    expect(fixture.nativeElement.style.whiteSpace).toBe('');

    for (const errors of [
      { missing: true, first: true },
      { forwarded: { errorPath: 'child' }, first: true },
    ]) {
      field.formControl.setErrors(errors);
      fixture.detectChanges();
      expect(content()).toBe('');
      expect(fixture.componentInstance.errorMessage).toBeUndefined();
    }
  });

  it('renders all messages on separate lines and updates as errors clear', () => {
    const { fixture, field, content } = renderMessages(true);
    expect(content()).toBe('First error.\nSecond error.');
    expect(fixture.nativeElement.style.whiteSpace).toBe('pre-line');

    field.formControl.setErrors({ second: { message: 'Second error.' } });
    fixture.detectChanges();
    expect(content()).toBe('Second error.');
    field.formControl.setErrors(null);
    fixture.detectChanges();
    expect(content()).toBe('');
  });

  it('skips unmapped, empty, inherited, and forwarded errors without suppressing later messages', () => {
    const { fixture, field, content } = renderMessages(true);
    field.validation.messages = { empty: () => '' };
    const errors = Object.assign(Object.create({ inherited: { message: 'Inherited' } }), {
      missing: true,
      empty: true,
      forwarded: { errorPath: 'child', message: 'Forwarded' },
      first: true,
      second: { message: 'Second error.' },
    });
    field.formControl.setErrors(errors);
    fixture.detectChanges();
    expect(content()).toBe('First error.\nSecond error.');
  });

  it('keeps message precedence and supplies the error and field to message functions', () => {
    const { fixture, field, content } = renderMessages(true);
    const error = { message: 'Error object' };
    const message = vi.fn(() => 'Async validator');
    field.validation.messages = { first: 'Field' };
    field.validators = { first: { message: 'Validator' } };
    field.asyncValidators = { first: { message } };
    field.formControl.setErrors({ first: error, second: { message: 'Second error.' } });
    fixture.detectChanges();
    expect(message).toHaveBeenCalledTimes(1);
    expect(message).toHaveBeenCalledWith(error, field);
    expect(content()).toBe('Async validator\nSecond error.');

    delete field.asyncValidators.first;
    field.formControl.setErrors({ first: error });
    fixture.detectChanges();
    expect(content()).toBe('Validator');
    delete field.validators.first;
    field.formControl.setErrors({ first: error });
    fixture.detectChanges();
    expect(content()).toBe('Field');
    delete field.validation.messages.first;
    field.formControl.setErrors({ first: error });
    fixture.detectChanges();
    expect(content()).toBe('Error object');
  });

  it('shows available messages while translations are pending and releases obsolete subscriptions', () => {
    const { fixture, field, content } = renderMessages(true);
    const translation = new Subject<string>();
    field.validation.messages = { first: () => translation, second: () => of('Second error.') };
    field.formControl.setErrors({ first: true, second: true });
    fixture.detectChanges();
    expect(content()).toBe('Second error.');

    translation.next('Translated first.');
    fixture.detectChanges();
    expect(content()).toBe('Translated first.\nSecond error.');
    translation.next('Updated first.');
    fixture.detectChanges();
    expect(content()).toBe('Updated first.\nSecond error.');

    field.formControl.setErrors({ second: true });
    fixture.detectChanges();
    expect(content()).toBe('Second error.');
    expect(translation.observers).toHaveLength(0);
    field.formControl.setErrors({ first: true });
    expect(translation.observers).toHaveLength(1);
    fixture.destroy();
    expect(translation.observers).toHaveLength(0);
  });

  it('updates the mode through expressions without replacing the field', () => {
    const { fixture, field, content } = renderMessages();
    for (const showAllErrors of [true, false]) {
      field.validation.showAllErrors = showAllErrors;
      field.options.fieldChanges.next({
        field,
        type: 'expressionChanges',
        property: 'validation.showAllErrors',
        value: showAllErrors,
      });
      fixture.detectChanges();
      expect(content()).toBe(showAllErrors ? 'First error.\nSecond error.' : 'First error.');
      expect(fixture.nativeElement.style.whiteSpace).toBe(showAllErrors ? 'pre-line' : '');
    }
  });
});
