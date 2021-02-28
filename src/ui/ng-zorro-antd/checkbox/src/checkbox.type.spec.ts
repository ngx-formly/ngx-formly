import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyNzCheckboxModule } from '@ngx-formly/ng-zorro-antd/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyNzCheckboxModule],
  });
};

describe('ui-ng-zorro-antd: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    expect(query('.ant-checkbox-indeterminate')).not.toBeNull();
    expect(query('input[type="checkbox"]')).not.toBeNull();
    const { attributes } = query('label[nz-checkbox]');
    expect(attributes).toMatchObject({
      id: 'formly_1_checkbox_name_0',
    });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    expect(query('.ant-checkbox-indeterminate')).not.toBeNull();
    expect(query('input[type="checkbox"]')).not.toBeNull();
    const { attributes } = query('label[nz-checkbox]');
    expect(attributes).toMatchObject({
      id: 'formly_1_boolean_name_0',
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
