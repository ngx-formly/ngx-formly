import { createFieldComponent as renderComponent } from '@ngx-formly/core/testing';

describe('Template Field Type', () => {
  it('should render template', () => {
    const { field, query, detectChanges } = renderComponent({
      template: '<div>foo</div>',
    });

    expect(query('formly-template')).not.toBeNull();
    expect(query('formly-template').nativeElement.textContent).toEqual('foo');

    field.template = '<div>bar</div>';
    detectChanges();
    expect(query('formly-template').nativeElement.textContent).toEqual('bar');
  });
});
