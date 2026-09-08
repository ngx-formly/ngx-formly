import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, expect, it, jest } from '@jest/globals';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyNzSelectModule } from '@ngx-formly/ng-zorro-antd/select';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyNzSelectModule],
  });
};

describe('ui-ng-zorro-antd: Select Type', () => {
  it('should render select type', async () => {
    const { query, queryAll, fixture } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();
    (query('nz-select').nativeElement as HTMLElement).click();
    fixture.autoDetectChanges();
    await fixture.whenStable();

    expect(queryAll('nz-option-item')).toHaveLength(3);
  });

  it('should render enum type', async () => {
    const { query, queryAll, fixture } = renderComponent({
      key: 'name',
      type: 'enum',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    (query('nz-select').nativeElement as HTMLElement).click();
    fixture.autoDetectChanges();
    await fixture.whenStable();

    expect(queryAll('nz-option-item')).toHaveLength(3);
  });

  it('should bind control value on change', async () => {
    const changeSpy = jest.fn();
    const { query, field, fixture } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        change: changeSpy,
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    (query('nz-select').nativeElement as HTMLElement).click();
    fixture.autoDetectChanges();
    await fixture.whenStable();

    (query('nz-option-item').nativeElement as HTMLElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });
});
