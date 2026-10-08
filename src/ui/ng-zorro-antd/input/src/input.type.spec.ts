import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyNzInputModule } from '@ngx-formly/ng-zorro-antd/input';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyNzInputModule],
  });
};

describe('ui-ng-zorro-antd: Input Type', () => {
  it('should render input type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    const { properties, attributes } = query('input[type="text"]');
    expect(properties).toMatchObject({ type: 'text' });
    expect(attributes).toMatchObject({
      id: 'formly_1_input_name_0',
    });
  });

  it('should render string type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'string',
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    const { properties, attributes } = query('input[type="text"]');
    expect(properties).toMatchObject({ type: 'text' });
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

    const { attributes } = query('nz-input-number input');
    expect(attributes).toMatchObject({
      id: 'formly_1_input_name_0',
    });
  });

  it('should render number type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'number',
    });

    const { attributes } = query('nz-input-number input');
    expect(attributes).toMatchObject({
      id: 'formly_1_number_name_0',
    });
  });

  it('should render integer type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'integer',
    });

    const { attributes } = query('nz-input-number input');
    expect(attributes).toMatchObject({
      id: 'formly_1_integer_name_0',
    });
  });

  it('should bind numeric values and clear the model', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'amount',
      type: 'number',
      defaultValue: 0,
      props: { label: 'Amount', placeholder: 'Enter amount' },
    });
    const input = query<HTMLInputElement>('nz-input-number input').nativeElement;

    expect(input.value).toBe('0');
    expect(input.placeholder).toBe('Enter amount');
    expect(query('label').attributes.for).toBe(input.id);

    input.value = '-12.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    detectChanges();
    expect(field.formControl.value).toBe(-12.5);
    expect(field.model.amount).toBe(-12.5);

    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    detectChanges();
    expect(field.formControl.value).toBeNull();
    expect(field.model.amount).toBeNull();

    field.formControl.disable();
    detectChanges();
    expect(input.disabled).toBe(true);
  });

  it('should preserve negative fractional values while typing', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'amount',
      type: 'number',
    });
    const input = query<HTMLInputElement>('nz-input-number input').nativeElement;

    for (const character of '-0.5') {
      input.value += character;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      detectChanges();
    }

    expect(input.value).toBe('-0.5');
    expect(field.formControl.value).toBe(-0.5);
    expect(field.model.amount).toBe(-0.5);
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
    const changeSpy = jest.fn();
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
