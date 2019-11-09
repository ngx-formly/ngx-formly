import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyCheckboxModule } from '@ngx-formly/ionic/checkbox';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyCheckboxModule],
  });
};

describe('ui-ionic: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();
    const { attributes } = query('ion-checkbox');
    expect(attributes).toMatchObject({
      id: 'formly_1_checkbox_name_0',
    });
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    const inputDebugEl = query<HTMLInputElement>('ion-checkbox');

    inputDebugEl.nativeElement.checked = true;
    inputDebugEl.triggerEventHandler('ionChange', { target: inputDebugEl.nativeElement });
    detectChanges();
    expect(field.formControl.value).toBeTrue();
  });
});
