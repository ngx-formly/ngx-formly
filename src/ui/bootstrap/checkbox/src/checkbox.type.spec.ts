import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyBootstrapCheckboxModule } from '@ngx-formly/bootstrap/checkbox';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapCheckboxModule],
  });
};

describe('ui-bootstrap: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();

    const { properties, attributes, classes } = query('input[type="checkbox"]');
    expect(properties).toMatchObject({ indeterminate: true });
    expect(classes).toMatchObject({ 'form-check-input': true });
    expect(attributes).toMatchObject({
      id: 'formly_1_checkbox_name_0',
      type: 'checkbox',
    });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();

    const { properties, attributes, classes } = query('input[type="checkbox"]');
    expect(properties).toMatchObject({ indeterminate: true });
    expect(classes).toMatchObject({ 'form-check-input': true });
    expect(attributes).toMatchObject({
      id: 'formly_1_boolean_name_0',
      type: 'checkbox',
    });
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
    expect(changeSpy).toHaveBeenCalledOnce();
    expect(field.formControl.value).toBeTrue();

    inputDebugEl.triggerEventHandler('change', ɵCustomEvent({ checked: false }));
    detectChanges();
    expect(changeSpy).toHaveBeenCalledTimes(2);
    expect(field.formControl.value).toBeFalse();
  });
});
