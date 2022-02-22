import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
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
    expect(attributes).toMatchObject({ id: 'formly_1_checkbox_name_0' });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    const { attributes } = query('p-checkbox');
    expect(attributes).toMatchObject({ id: 'formly_1_boolean_name_0' });
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'checkbox',
      templateOptions: { change: changeSpy },
    });

    const inputDebugEl = query<HTMLInputElement>('input[type="checkbox"]');

    inputDebugEl.triggerEventHandler('change', ɵCustomEvent({ checked: true }));
    detectChanges();
    expect(field.formControl.value).toBeTrue();
    expect(changeSpy).toHaveBeenCalledOnce();

    inputDebugEl.triggerEventHandler('change', ɵCustomEvent({ checked: false }));
    detectChanges();
    expect(field.formControl.value).toBeFalse();
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });
});
