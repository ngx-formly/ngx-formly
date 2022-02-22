import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { FormlyBootstrapSelectModule } from '@ngx-formly/bootstrap/select';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapSelectModule],
  });
};

describe('ui-bootstrap: Select Type', () => {
  it('should render select type', () => {
    const { query, queryAll } = renderComponent({
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

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('option')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query, queryAll } = renderComponent({
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

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('option')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        change: changeSpy,
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const value = query('select option').properties.value;
    query('select').triggerEventHandler('change', ɵCustomEvent({ value }));
    detectChanges();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledOnce();
  });

  it('should select placeholder option when value is undefined', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        placeholder: 'Placeholder option',
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
        ],
      },
    });

    const { options, selectedIndex } = query<HTMLSelectElement>('select').nativeElement;
    expect(options[selectedIndex]).toBeDefined();
    expect(options[selectedIndex].text).toEqual('Placeholder option');
  });

  it(`should call change callback after formControl update`, () => {
    const changeFnSpy = jest.fn();
    const { query, field } = renderComponent({
      key: 'sportId',
      type: 'select',
      templateOptions: {
        placeholder: 'sport',
        change: (f) => changeFnSpy(f.formControl.value),
        options: [{ value: '1', label: 'Soccer' }],
      },
    });

    expect(field.formControl.value).toEqual(undefined);

    const select = query('select').nativeElement as HTMLSelectElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));

    expect(changeFnSpy).toHaveBeenCalledWith('1');
    expect(field.formControl.value).toEqual('1');
  });

  describe('render select options', () => {
    it('should correctly bind to a static array of data', () => {
      const { queryAll } = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          options: [
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      expect(queryAll('select option')).toHaveLength(3);
    });

    it('should correctly bind to an Observable', () => {
      const { queryAll } = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          options: of([
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ]),
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      expect(queryAll('select option')).toHaveLength(3);
    });
  });
});
