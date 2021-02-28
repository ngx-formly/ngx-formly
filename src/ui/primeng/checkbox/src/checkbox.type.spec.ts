import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyCheckboxModule } from '@ngx-formly/primeng/checkbox';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyCheckboxModule],
  });
};

describe('ui-primeng: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    const { attributes } = query('p-checkbox');
    expect(attributes).toMatchObject({
      id: 'formly_1_checkbox_name_0',
      binary: 'true',
    });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    const { attributes } = query('p-checkbox');
    expect(attributes).toMatchObject({
      id: 'formly_1_boolean_name_0',
      binary: 'true',
    });
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
