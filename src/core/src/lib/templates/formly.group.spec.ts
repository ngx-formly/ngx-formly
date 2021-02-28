import { createFieldComponent as renderComponent } from '@ngx-formly/core/testing';

describe('Group Field Type', () => {
  it('should render fieldGroup', () => {
    const { query, queryAll } = renderComponent({
      type: 'formly-group',
      fieldGroup: [{ key: 'title1' }, { key: 'title2' }],
    });

    expect(query('formly-group')).not.toBeNull();
    expect(queryAll('formly-group > formly-field')).toHaveLength(2);
  });

  it('should add fieldGroupClassName', () => {
    const { field, query, detectChanges } = renderComponent({
      fieldGroupClassName: 'foo-class',
      type: 'formly-group',
    });

    expect(query('formly-group').properties.className).toEqual('foo-class');

    field.fieldGroupClassName = 'bar-class';
    detectChanges();
    expect(query('formly-group').properties.className).toEqual('bar-class');
  });
});
