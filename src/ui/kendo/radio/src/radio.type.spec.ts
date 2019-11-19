import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyRadioModule } from '@ngx-formly/kendo/radio';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyRadioModule],
  });
};

describe('ui-kendo: Radio Type', () => {
  it('should render radio type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'radio',
      templateOptions: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();
    expect(queryAll('input[type="radio"]')).toHaveLength(3);
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'radio',
      validation: { show: true },
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('input[type="radio"]').classes['ng-invalid']).toBeTrue();
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
