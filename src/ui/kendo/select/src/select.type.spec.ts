import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/kendo/select';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
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
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();

    query<HTMLElement>('kendo-dropdownlist').nativeElement.click();
    expect(document.querySelectorAll('.k-list-item')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query } = renderComponent({
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

    query<HTMLElement>('kendo-dropdownlist').nativeElement.click();
    expect(document.querySelectorAll('.k-list-item')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        change: changeSpy,
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
        ],
      },
    });

    query<HTMLElement>('kendo-dropdownlist').nativeElement.click();
    document.querySelector<HTMLLIElement>('.k-list-item').click();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
