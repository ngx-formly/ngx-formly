import { fakeAsync, tick } from '@angular/core/testing';
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
  it('should select multiple values and disable unavailable options', fakeAsync(() => {
    const changeSpy = jest.fn();
    const { query, detectChanges, field } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        label: 'Select Multiple',
        multiple: true,
        change: changeSpy,
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Unavailable', disabled: true },
        ],
      },
    });
    query('kendo-multiselect').componentInstance.toggle(true);
    tick();
    detectChanges();
    const items = document.querySelectorAll<HTMLLIElement>('.k-list-item');
    expect(items).toHaveLength(3);
    expect(items[2].classList.contains('k-disabled')).toBe(true);
    items[0].click();
    detectChanges();
    query('kendo-multiselect').componentInstance.toggle(true);
    tick();
    detectChanges();
    document.querySelectorAll<HTMLLIElement>('.k-list-item')[1].click();
    expect(field.formControl.value).toEqual([1, 2]);
    expect(changeSpy).toHaveBeenCalledTimes(2);
    tick(300);
  }));

  it('should render select type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
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
      props: {
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
      props: {
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
