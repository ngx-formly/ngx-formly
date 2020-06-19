import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyNzSelectModule } from '@ngx-formly/ng-zorro-antd/select';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { fakeAsync, tick } from '@angular/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyNzSelectModule],
  });
};

describe('ui-ng-zorro-antd: Select Type', () => {
  it('should render select type', fakeAsync(() => {
    const { query, queryAll, fixture } = renderComponent({
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

    query('nz-select nz-select-top-control').triggerEventHandler('click', {});
    fixture.autoDetectChanges();
    tick(500);

    expect(queryAll('nz-option-item')).toHaveLength(3);
  }));

  it('should render enum type', fakeAsync(() => {
    const { query, queryAll, fixture } = renderComponent({
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

    query('nz-select nz-select-top-control').triggerEventHandler('click', {});
    fixture.autoDetectChanges();
    tick(500);

    expect(queryAll('nz-option-item')).toHaveLength(3);
  }));

  it('should bind control value on change', fakeAsync(() => {
    const { query, field, fixture } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    query('nz-select nz-select-top-control').triggerEventHandler('click', {});
    fixture.autoDetectChanges();
    tick(500);

    query('nz-option-item').triggerEventHandler('click', {});
    fixture.detectChanges();
    tick(500);
    expect(field.formControl.value).toEqual(1);
  }));
});
