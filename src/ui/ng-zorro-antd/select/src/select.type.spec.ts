import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyNzSelectModule } from '@ngx-formly/ng-zorro-antd/select';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyNzSelectModule],
  });
};

describe('ui-ng-zorro-antd: Select Type', () => {
  it('should render select type', () => {
    const { query, queryAll, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    query('nz-select').triggerEventHandler('click', {});
    detectChanges();

    expect(queryAll('li[nz-option-li]')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query, queryAll, detectChanges } = renderComponent({
      key: 'name',
      type: 'enum',
      templateOptions: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    query('nz-select').triggerEventHandler('click', {});
    detectChanges();

    expect(queryAll('li[nz-option-li]')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    query('nz-select').triggerEventHandler('click', {});
    detectChanges();

    query('li[nz-option-li]').triggerEventHandler('click', {});
    detectChanges();
    expect(field.formControl.value).toEqual(1);
  });
});
