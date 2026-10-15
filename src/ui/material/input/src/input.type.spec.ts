import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyMatInputModule } from '@ngx-formly/material/input';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyMatInputModule],
  });
};

describe('ui-material: Input Type', () => {
  it.each([
    { showAllErrors: false, subscriptSizing: undefined, expectedSizing: 'fixed' },
    { showAllErrors: true, subscriptSizing: undefined, expectedSizing: 'dynamic' },
    { showAllErrors: true, subscriptSizing: 'fixed', expectedSizing: 'fixed' },
  ])(
    'sizes the error area for $showAllErrors and $subscriptSizing',
    ({ showAllErrors, subscriptSizing, expectedSizing }) => {
      const { query } = renderComponent({
        key: 'name',
        type: 'input',
        validation: { show: true, showAllErrors },
        props: { subscriptSizing },
        validators: {
          first: { expression: () => false, message: 'First error.' },
          second: { expression: () => false, message: 'Second error.' },
        },
      });
      expect(query('mat-form-field').componentInstance.subscriptSizing).toBe(expectedSizing);
      expect(query('mat-error').nativeElement.textContent.trim()).toBe(
        showAllErrors ? 'First error.\nSecond error.' : 'First error.',
      );
    },
  );

  it('should render input type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
      name: 'custom_name',
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();

    const { attributes } = query('input[type="text"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_input_name_0',
      name: 'custom_name',
    });
  });

  it('should render string type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'string',
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();

    const { attributes } = query('input[type="text"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_string_name_0',
    });
  });

  it('should render input[number] type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
      props: { type: 'number' },
    });

    const { attributes } = query('input[type="number"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_input_name_0',
    });
  });

  it('should render number type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'number',
    });

    const { attributes } = query('input[type="number"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_number_name_0',
    });
  });

  it('should render integer type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'integer',
    });

    const { attributes } = query('input[type="number"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_integer_name_0',
    });
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
      validation: { show: true },
      props: { required: true },
    });

    const { classes } = query('input[type="text"]');
    expect(classes['ng-invalid']).toBe(true);
  });

  it('should bind control value on change', () => {
    const changeSpy = vi.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'input',
      props: { change: changeSpy },
    });

    ['input', 'change'].forEach((type) =>
      query('input[type="text"]').triggerEventHandler(type, ɵCustomEvent({ value: 'foo' })),
    );
    detectChanges();
    expect(field.formControl.value).toEqual('foo');
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });
});
