import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyBootstrapTextAreaModule } from '@ngx-formly/bootstrap/textarea';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyBootstrapTextAreaModule],
  });
};

describe('ui-bootstrap: Textarea Type', () => {
  it('should render textarea type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      templateOptions: {
        cols: 5,
        rows: 7,
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    const { properties, attributes } = query('textarea');
    expect(properties).toMatchObject({
      cols: 5,
      rows: 7,
    });
    expect(attributes).toMatchObject({
      class: 'form-control ng-untouched ng-pristine ng-valid',
      id: 'formly_1_textarea_name_0',
    });
  });

  it('should add "is-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      validation: { show: true },
      templateOptions: { required: true },
    });

    expect(query('textarea').classes['is-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'textarea',
    });

    query('textarea').triggerEventHandler('input', { target: { value: 'foo' } });
    detectChanges();
    expect(field.formControl.value).toEqual('foo');
  });
});
