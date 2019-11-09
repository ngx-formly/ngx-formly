import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/kendo/select';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlySelectModule],
    providers: [
      {
        provide: POPUP_CONTAINER,
        useFactory: () => ({ nativeElement: document.body }),
      },
    ],
  });
};

describe('ui-kendo: Select Type', () => {
  it('should render select type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        label: 'Select',
        options: [{ value: 1, label: 'label 1' }, { value: 2, label: 'label 2' }, { value: 3, label: 'label 3' }],
      },
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();

    query('kendo-dropdownlist .k-dropdown-wrap').triggerEventHandler('click', {});
    expect(document.querySelectorAll('.k-item')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const { query, field } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    query('kendo-dropdownlist .k-dropdown-wrap').triggerEventHandler('click', {});
    document.querySelector<HTMLLIElement>('.k-item').click();
    expect(field.formControl.value).toEqual(1);
  });
});
