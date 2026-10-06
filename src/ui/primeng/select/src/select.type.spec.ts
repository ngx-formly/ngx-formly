import { fakeAsync, tick } from '@angular/core/testing';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/primeng/select';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlySelectModule],
  });
};

describe('ui-primeng: Select Type', () => {
  it('should select multiple values and disable unavailable options', fakeAsync(() => {
    const changeSpy = jest.fn();
    const { query, queryAll, detectChanges, field } = renderComponent({
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
    query('p-multiselect').componentInstance.show(true);
    tick();
    detectChanges();
    const items = queryAll('li[pMultiSelectItem]');
    expect(items).toHaveLength(3);
    expect(items[2].componentInstance.disabled).toBe(true);
    queryAll('li[pMultiSelectItem]')[0].triggerEventHandler('click', new MouseEvent('click'));
    detectChanges();
    queryAll('li[pMultiSelectItem]')[1].triggerEventHandler('click', new MouseEvent('click'));
    expect(field.formControl.value).toEqual([1, 2]);
    expect(changeSpy).toHaveBeenCalledTimes(2);
    tick(300);
  }));

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

    query('p-select').componentInstance.show(true);
    detectChanges();
    expect(queryAll('p-selectItem')).toHaveLength(3);
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

    query('p-select').componentInstance.show(true);
    detectChanges();
    expect(queryAll('p-selectItem')).toHaveLength(3);
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

    query('p-select').componentInstance.show(true);
    detectChanges();
    queryAll('p-selectItem>li')[1].triggerEventHandler('click', new MouseEvent('click'));
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
    query('p-select').componentInstance.show(true);
    detectChanges();
    expect(queryAll('p-selectItem')).toHaveLength(3);

    const inputQuery = 'p-select input.p-select-filter';
    query(inputQuery).triggerEventHandler('input', { target: { value: 'pie' } });
    detectChanges();
    expect(queryAll('p-selectItem')).toHaveLength(2);
    expect(queryAll('p-selectItem>li')[0].nativeElement.textContent).toEqual('apple-pie label');
  });
});
