import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/primeng/select';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlySelectModule],
  });
};

describe('ui-primeng: Select Type', () => {
  it('should render select type', () => {
    const { query, queryAll, detectChanges } = renderComponent({
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

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    query('p-dropdown').componentInstance.show(true);
    detectChanges();
    expect(queryAll('p-dropdownItem')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query, queryAll, detectChanges } = renderComponent({
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

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();

    query('p-dropdown').componentInstance.show(true);
    detectChanges();
    expect(queryAll('p-dropdownItem')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, queryAll, detectChanges, field } = renderComponent({
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

    query('p-dropdown').componentInstance.show(true);
    detectChanges();
    queryAll('p-dropdownItem>li')[1].triggerEventHandler('click', {});
    expect(field.formControl.value).toEqual(2);
    expect(changeSpy).toHaveBeenCalledOnce();
  });

  it('should filter results on search', () => {
    const { query, queryAll, detectChanges } = renderComponent({
      key: 'name',
      type: 'enum',
      props: {
        label: 'Select',
        filter: true,
        options: [
          { value: 1, label: 'apple label' },
          { value: 2, label: 'apple-pie label' },
          { value: 3, label: 'pie label' },
        ],
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();
    query('p-dropdown').componentInstance.show(true);
    detectChanges();
    expect(queryAll('p-dropdownItem')).toHaveLength(3);

    const inputQuery = 'p-dropdown input.p-dropdown-filter';
    query(inputQuery).triggerEventHandler('input', { target: { value: 'pie' } });
    detectChanges();
    expect(queryAll('p-dropdownItem')).toHaveLength(2);
    expect(queryAll('p-dropdownItem>li')[0].nativeElement.textContent).toEqual('apple-pie label');
  });
});
