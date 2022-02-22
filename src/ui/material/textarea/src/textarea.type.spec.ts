import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyMatTextAreaModule } from '@ngx-formly/material/textarea';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyMatTextAreaModule],
  });
};

describe('ui-material: Textarea Type', () => {
  it('should render textarea type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      templateOptions: {
        cols: 5,
        rows: 7,
      },
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();
    const { properties, attributes } = query('textarea');
    expect(properties).toMatchObject({
      cols: 5,
      rows: 7,
    });
    expect(attributes).toMatchObject({
      id: 'formly_1_textarea_name_0',
    });
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      validation: { show: true },
      templateOptions: { required: true },
    });

    expect(query('textarea').classes['ng-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'textarea',
      templateOptions: { change: changeSpy },
    });

    ['input', 'change'].forEach((type) => query('textarea').triggerEventHandler(type, ɵCustomEvent({ value: 'foo' })));
    detectChanges();
    expect(field.formControl.value).toEqual('foo');
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
