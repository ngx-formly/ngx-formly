import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/kendo/select';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { DebugElement } from '@angular/core';

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

function triggerSelectClick(element: DebugElement) {
  element.triggerEventHandler('click', {
    stopPropagation: () => {},
    preventDefault: () => {},
  });
}

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

    const evt = {
      stopPropagation: () => {},
      preventDefault: () => {},
    };

    triggerSelectClick(query('kendo-dropdownlist .k-dropdown-wrap'));
    expect(document.querySelectorAll('.k-item')).toHaveLength(3);
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

    triggerSelectClick(query('kendo-dropdownlist .k-dropdown-wrap'));
    expect(document.querySelectorAll('.k-item')).toHaveLength(3);
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

    triggerSelectClick(query('kendo-dropdownlist .k-dropdown-wrap'));
    document.querySelector<HTMLLIElement>('.k-item').click();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
