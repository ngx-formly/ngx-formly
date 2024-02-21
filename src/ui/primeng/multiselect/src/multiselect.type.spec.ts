import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/primeng/select';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyMultiSelectModule } from './multiselect.module';
import { BehaviorSubject } from 'rxjs';

const openDropdown = (query: Function) => {
  query('div.p-multiselect').triggerEventHandler('click', ɵCustomEvent({ isSameNode: () => false }));
};

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyMultiSelectModule],
  });
};

describe('ui-primeng: MultiSelect Type', () => {
  it('should render multiselectselect type', () => {
    const { query, queryAll, fixture } = renderComponent({
      key: 'multiselect',
      type: 'multiselect',
      props: {
        label: 'Multiselect',
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();
    openDropdown(query);
    fixture.detectChanges();
    expect(queryAll('li.p-multiselect-item')).toHaveLength(3);
  });

  it('should work with observables', () => {
    const opts = new BehaviorSubject([
      { value: 1, label: 'apple label' },
      { value: 2, label: 'apple-pie label' },
      { value: 3, label: 'pie label' },
    ]);
    const { query, queryAll, fixture } = renderComponent({
      key: 'multiselect',
      type: 'multiselect',
      props: {
        label: 'Multiselect',
        options: opts,
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();
    openDropdown(query);
    fixture.detectChanges();
    expect(queryAll('li.p-multiselect-item')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, queryAll, field, fixture } = renderComponent({
      key: 'name',
      type: 'multiselect',
      props: {
        change: changeSpy,
        optionValue: 'value',
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    openDropdown(query);
    fixture.detectChanges();
    queryAll('li.p-multiselect-item')[1].triggerEventHandler('click', {});
    queryAll('li.p-multiselect-item')[2].triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(field.formControl.value).toEqual([2, 3]);
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });

  it('should reflect options changes', () => {
    const opts = new BehaviorSubject([
      { value: 1, label: 'apple label' },
      { value: 2, label: 'apple-pie label' },
      { value: 3, label: 'pie label' },
    ]);
    const { query, queryAll, fixture } = renderComponent({
      key: 'multiselect',
      type: 'multiselect',
      props: {
        label: 'Multiselect',
        options: opts,
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();
    openDropdown(query);
    fixture.detectChanges();
    expect(queryAll('li.p-multiselect-item')).toHaveLength(3);
    opts.next([...opts.value, { value: 4, label: 'new label' }]);
    fixture.detectChanges();
    expect(queryAll('li.p-multiselect-item')).toHaveLength(4);
  });

  it('should clear results on clear', () => {
    const { query, queryAll, field, fixture } = renderComponent({
      key: 'name',
      type: 'multiselect',
      props: {
        optionValue: 'value',
        showClear: true,
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    openDropdown(query);
    fixture.detectChanges();
    queryAll('li.p-multiselect-item')[1].triggerEventHandler('click', {});
    queryAll('li.p-multiselect-item')[2].triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(field.formControl.value).toEqual([2, 3]);
    query('i.p-multiselect-clear-icon').triggerEventHandler('click', ɵCustomEvent({ isSameNode: () => false }));
    fixture.detectChanges();
    expect(field.formControl.value).toEqual(null);
  });

  it('should filter results on search', () => {
    const { query, queryAll, fixture } = renderComponent({
      key: 'name',
      type: 'multiselect',
      props: {
        label: 'MultiSelect',
        filter: true,
        options: [
          { value: 1, label: 'apple label' },
          { value: 2, label: 'apple-pie label' },
          { value: 3, label: 'pie label' },
        ],
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();
    const inputQuery = '.p-multiselect-filter-container input';

    openDropdown(query);
    fixture.detectChanges();
    expect(queryAll('li.p-multiselect-item')).toHaveLength(3);

    query(inputQuery).triggerEventHandler('input', { target: { value: 'pie' } });
    fixture.detectChanges();
    expect(queryAll('li.p-multiselect-item')).toHaveLength(2);
    expect(queryAll('.p-multiselect-item>span')[0].nativeElement.textContent).toEqual('apple-pie label');
  });
});
