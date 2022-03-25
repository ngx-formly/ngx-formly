import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyTextAreaModule } from '@ngx-formly/kendo/textarea';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyTextAreaModule],
  });
};

describe('ui-kendo: Textarea Type', () => {
  it('should render textarea type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();
    const { attributes } = query('textarea');
    expect(attributes).toMatchObject({
      class: 'k-textarea k-input k-input-md k-rounded-md k-input-solid k-autofill ng-untouched ng-pristine ng-valid',
      id: 'formly_1_textarea_name_0',
    });
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      validation: { show: true },
      props: { required: true },
    });

    expect(query('textarea').classes['ng-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, detectChanges } = renderComponent({
      key: 'name',
      type: 'textarea',
      props: { change: changeSpy },
    });

    ['input', 'change'].forEach((type) => query('textarea').triggerEventHandler(type, ɵCustomEvent({ value: 'foo' })));
    detectChanges();
    // expect(field.formControl.value).toEqual('foo');
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
