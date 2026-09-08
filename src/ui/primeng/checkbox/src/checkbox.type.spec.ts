import { describe, expect, it, jest } from '@jest/globals';
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

    const { attributes } = query('p-checkbox input');
    expect(attributes).toMatchObject({ id: 'formly_1_checkbox_name_0' });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    const { attributes } = query('p-checkbox input');
    expect(attributes).toMatchObject({ id: 'formly_1_boolean_name_0' });
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'checkbox',
      props: { change: changeSpy },
    });

    const inputElm = query<HTMLInputElement>('input[type="checkbox"]').nativeElement;

    inputElm.click();
    detectChanges();
    expect(field.formControl.value).toBe(true);
    expect(changeSpy).toHaveBeenCalledTimes(1);

    inputElm.click();
    detectChanges();
    expect(field.formControl.value).toBe(false);
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });
});
