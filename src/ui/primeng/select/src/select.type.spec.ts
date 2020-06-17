import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/primeng/select';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { fakeAsync, tick } from '@angular/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlySelectModule],
  });
};

describe('ui-primeng: Select Type', () => {
  it('should render select type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        label: 'Select',
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    query('p-dropdown div').triggerEventHandler('click', { target: { isSameNode: () => false } });
    expect(queryAll('p-dropdownItem')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'enum',
      templateOptions: {
        label: 'Select',
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    query('p-dropdown div').triggerEventHandler('click', { target: { isSameNode: () => false } });
    expect(queryAll('p-dropdownItem')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const { query, queryAll, field } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
        ],
      },
    });

    query('p-dropdown div').triggerEventHandler('click', { target: { isSameNode: () => false } });
    queryAll('p-dropdownItem>li')[1].triggerEventHandler('click', {});
    expect(field.formControl.value).toEqual(2);
  });
});
