import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyMatCheckboxModule } from '@ngx-formly/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyMatCheckboxModule],
  });
};

describe('ui-material: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();

    const { attributes } = query('mat-checkbox');
    expect(attributes).toMatchObject({ id: 'formly_1_checkbox_name_0' });
    expect(query('input[type="checkbox"]').properties).toMatchObject({
      indeterminate: true,
    });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();

    const { attributes } = query('mat-checkbox');
    expect(attributes).toMatchObject({ id: 'formly_1_boolean_name_0' });
    expect(query('input[type="checkbox"]').properties).toMatchObject({
      indeterminate: true,
    });
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'checkbox',
      props: { change: changeSpy },
    });

    const input = query('input[type="checkbox"]').nativeElement as HTMLInputElement;
    input.click();
    detectChanges();
    expect(field.formControl.value).toBeTrue();
    expect(changeSpy).toHaveBeenCalledOnce();

    input.click();
    detectChanges();
    expect(field.formControl.value).toBeFalse();
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });
});
