import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { FormlyBootstrapSelectModule } from '@ngx-formly/bootstrap/select';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyBootstrapSelectModule],
  });
};

describe('ui-bootstrap: Select Type', () => {
  it('should render select type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }, { value: 2, label: 'label 2' }, { value: 3, label: 'label 3' }],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('option')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const value = query('select option').properties.value;
    query('select').triggerEventHandler('change', { target: { value } });
    detectChanges();
    expect(field.formControl.value).toEqual(1);
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
