import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyBootstrapInputModule } from '@ngx-formly/bootstrap/input';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapInputModule],
  });
};

describe('ui-bootstrap: Input Type', () => {
  it('should render input type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();

    const { properties, attributes } = query('input[type="text"]');
    expect(properties).toMatchObject({ type: 'text' });
    expect(attributes).toMatchObject({
      class: 'form-control ng-untouched ng-pristine ng-valid',
      id: 'formly_1_input_name_0',
    });
  });

  it('should render string type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'string',
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();

    const { properties, attributes } = query('input[type="text"]');
    expect(properties).toMatchObject({ type: 'text' });
    expect(attributes).toMatchObject({
      class: 'form-control ng-untouched ng-pristine ng-valid',
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
      class: 'form-control ng-untouched ng-pristine ng-valid',
      id: 'formly_1_input_name_0',
      type: 'number',
    });
  });

  it('should render number type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'number',
    });

    const { attributes } = query('input[type="number"]');
    expect(attributes).toMatchObject({
      class: 'form-control ng-untouched ng-pristine ng-valid',
      id: 'formly_1_number_name_0',
      type: 'number',
    });
  });

  it('should render integer type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'integer',
    });

    const { attributes } = query('input[type="number"]');
    expect(attributes).toMatchObject({
      class: 'form-control ng-untouched ng-pristine ng-valid',
      id: 'formly_1_integer_name_0',
      type: 'number',
    });
  });

  it('should add "is-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
      validation: { show: true },
      props: { required: true },
    });

    const { classes } = query('input[type="text"]');
    expect(classes['is-invalid']).toBeTrue();
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
