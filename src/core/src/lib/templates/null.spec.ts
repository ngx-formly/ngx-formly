import { createFormlyFieldComponent as renderComponent } from '@ngx-formly/core/testing';

describe('Null Field Type', () => {
  it('should render null', () => {
    const { query, queryAll } = renderComponent({
      type: 'null',
    });

    expect(query('null')).toBeNull();
    expect(queryAll('formly')).toHaveLength(0);
  });
});
