import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyInputModule } from '@ngx-formly/kendo/input';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyInputModule],
  });
};

describe('ui-kendo: Input Type', () => {
  it('should render input type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();

    const { properties, attributes } = query('input[type="text"]');
    expect(properties).toMatchObject({ type: 'text' });
    expect(attributes).toMatchObject({
      class: 'ng-untouched ng-pristine ng-valid k-textbox k-input k-input-md k-rounded-md k-input-solid',
      id: 'formly_1_input_name_0',
    });
  });

  it('should render string type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'string',
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();

    const { properties, attributes } = query('input[type="text"]');
    expect(properties).toMatchObject({ type: 'text' });
    expect(attributes).toMatchObject({
      class: 'ng-untouched ng-pristine ng-valid k-textbox k-input k-input-md k-rounded-md k-input-solid',
      id: 'formly_1_string_name_0',
    });
  });

  it('should render input[number] type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
      props: { type: 'number' },
    });

    const { attributes } = query('kendo-numerictextbox');
    expect(attributes).toMatchObject({
      class: 'k-input k-numerictextbox ng-untouched ng-pristine ng-valid k-input-md k-rounded-md k-input-solid',
      id: 'formly_1_input_name_0',
    });
  });

  it('should render number type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'number',
    });

    const { attributes } = query('kendo-numerictextbox');
    expect(attributes).toMatchObject({
      class: 'k-input k-numerictextbox ng-untouched ng-pristine ng-valid k-input-md k-rounded-md k-input-solid',
      id: 'formly_1_number_name_0',
    });
  });

  it('should render integer type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'integer',
    });

    const { attributes } = query('kendo-numerictextbox');
    expect(attributes).toMatchObject({
      class: 'k-input k-numerictextbox ng-untouched ng-pristine ng-valid k-input-md k-rounded-md k-input-solid',
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
    expect(classes['ng-invalid']).toBeTrue();
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
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
