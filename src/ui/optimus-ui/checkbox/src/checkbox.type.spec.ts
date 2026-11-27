import { describe, expect, it, vi } from 'vitest';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyCheckboxModule } from '@ngx-formly/optimus-ui/checkbox';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyCheckboxModule],
  });
};

describe('ui-optimus-ui: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    expect(query('formly-wrapper-optimus-ui-form-field')).not.toBeNull();

    const { attributes } = query('p-checkbox input');
    expect(attributes).toMatchObject({ id: 'formly_1_checkbox_name_0' });
    expect(query('p-checkbox').nativeElement.id).toBe(attributes.id + '-container');
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-optimus-ui-form-field')).not.toBeNull();

    const { attributes } = query('p-checkbox input');
    expect(attributes).toMatchObject({ id: 'formly_1_boolean_name_0' });
  });

  it.each([false, true])('should bind control value on change with allowHtml=%s', (allowHtml) => {
    const changeSpy = vi.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'checkbox',
      props: { change: changeSpy, allowHtml, label: 'Accept <strong>terms</strong>' },
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
