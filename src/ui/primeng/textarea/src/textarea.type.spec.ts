import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyTextAreaModule } from '@ngx-formly/primeng/textarea';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyTextAreaModule],
  });
};

describe('ui-primeng: Textarea Type', () => {
  it('should render textarea type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();
    const { attributes } = query('textarea');
    expect(attributes).toMatchObject({
      id: 'formly_1_textarea_name_0',
    });
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      validation: { show: true },
      templateOptions: { required: true },
    });

    expect(query('textarea').classes['ng-invalid']).toBeTrue();
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
