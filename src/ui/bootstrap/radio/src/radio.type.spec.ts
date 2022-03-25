import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyBootstrapRadioModule } from '@ngx-formly/bootstrap/radio';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapRadioModule],
  });
};

describe('ui-bootstrap: Radio Type', () => {
  it('should render radio type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('input[type="radio"]')).toHaveLength(3);
  });

  it('should add "is-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'radio',
      validation: { show: true },
      props: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('input[type="radio"]').classes['is-invalid']).toBeTrue();
  });

  it('should render with custom formCheck', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        formCheck: 'default',
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const formCheckElm = query('div.form-check');

    // 'default'
    expect(formCheckElm).not.toBeNull();

    // 'inline'
    field.props.formCheck = 'inline';
    detectChanges();
    expect(formCheckElm.classes).toEqual({
      'form-check': true,
      'form-check-inline': true,
    });
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        options: [{ value: 1, label: 'label 1' }],
        change: changeSpy,
      },
    });

    query('input[type="radio"]').triggerEventHandler('change', ɵCustomEvent());
    detectChanges();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
