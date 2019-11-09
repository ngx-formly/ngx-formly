import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyBootstrapRadioModule } from '@ngx-formly/bootstrap/radio';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyBootstrapRadioModule],
  });
};

describe('ui-bootstrap: Radio Type', () => {
  it('should render radio type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'radio',
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }, { value: 2, label: 'label 2' }, { value: 3, label: 'label 3' }],
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
      templateOptions: {
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
      templateOptions: {
        formCheck: 'custom',
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const { classes } = query('div > div');

    // 'custom'
    expect(classes).toEqual({
      'form-check': false,
      'custom-control': true,
      'custom-control-inline': false,
      'custom-radio': true,
      'form-check-inline': false,
    });

    // 'stacked'
    field.templateOptions.formCheck = 'stacked';
    detectChanges();
    expect(classes).toEqual({
      'custom-control': false,
      'custom-control-inline': false,
      'form-check': true,
      'custom-radio': false,
      'form-check-inline': false,
    });

    // 'inline'
    field.templateOptions.formCheck = 'inline';
    detectChanges();
    expect(classes).toEqual({
      'custom-control': false,
      'custom-control-inline': false,
      'form-check': true,
      'custom-radio': false,
      'form-check-inline': true,
    });
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    query('input[type="radio"]').triggerEventHandler('change', {});
    detectChanges();
    expect(field.formControl.value).toEqual(1);
  });
});
