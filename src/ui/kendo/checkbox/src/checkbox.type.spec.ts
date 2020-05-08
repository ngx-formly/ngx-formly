import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyCheckboxModule } from '@ngx-formly/kendo/checkbox';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyCheckboxModule],
  });
};

describe('ui-kendo: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
      templateOptions: {
        label: 'Name',
        required: true,
      },
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();
    expect(query('label').nativeElement.textContent).toEqual(' Name *');

    const { attributes } = query('input[type="checkbox"]');
    expect(attributes).toMatchObject({
      class: 'k-checkbox',
      id: 'formly_1_checkbox_name_0',
      type: 'checkbox',
    });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
      templateOptions: {
        label: 'Name',
        required: true,
      },
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();
    expect(query('label').nativeElement.textContent).toEqual(' Name *');

    const { attributes } = query('input[type="checkbox"]');
    expect(attributes).toMatchObject({
      class: 'k-checkbox',
      id: 'formly_1_boolean_name_0',
      type: 'checkbox',
    });
  });

  it('should add "k-state-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
      validation: { show: true },
      templateOptions: { required: true },
    });

    const { classes } = query('input[type="checkbox"]');
    expect(classes['k-state-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    const inputDebugEl = query<HTMLInputElement>('input[type="checkbox"]');

    inputDebugEl.triggerEventHandler('change', { target: { checked: true } });
    detectChanges();
    expect(field.formControl.value).toBeTrue();

    inputDebugEl.triggerEventHandler('change', { target: { checked: false } });
    detectChanges();
    expect(field.formControl.value).toBeFalse();
  });
});
