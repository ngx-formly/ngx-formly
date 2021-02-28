import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyInputModule } from '@ngx-formly/ionic/input';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyInputModule],
  });
};

describe('ui-ionic: Input Type', () => {
  it('should render input type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
    });

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();

    const { attributes } = query('ion-input');
    expect(attributes).toMatchObject({
      id: 'formly_1_input_name_0',
    });
  });

  it('should render string type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'string',
    });

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();

    const { attributes } = query('ion-input');
    expect(attributes).toMatchObject({
      id: 'formly_1_string_name_0',
    });
  });

  it('should render input[number] type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
      templateOptions: { type: 'number' },
    });

    const { attributes } = query('ion-input[type="number"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_input_name_0',
      type: 'number',
    });
  });

  it('should render number type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'number',
    });

    const { attributes } = query('ion-input[type="number"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_number_name_0',
      type: 'number',
    });
  });

  it('should render integer type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'integer',
    });

    const { attributes } = query('ion-input[type="number"]');
    expect(attributes).toMatchObject({
      id: 'formly_1_integer_name_0',
      type: 'number',
    });
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'input',
      validation: { show: true },
      templateOptions: { required: true },
    });

    const { classes } = query('ion-input');
    expect(classes['ng-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'input',
    });

    const inputEl = query<HTMLInputElement>('ion-input').nativeElement;
    inputEl.value = 'foo';
    query('ion-input').triggerEventHandler('ionChange', { target: inputEl });
    detectChanges();
    expect(field.formControl.value).toEqual('foo');
  });
});
