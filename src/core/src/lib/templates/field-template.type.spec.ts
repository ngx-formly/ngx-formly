import { createFormlyFieldComponent as renderComponent } from '@ngx-formly/core/testing';

describe('Template Field Type', () => {
  it('should render template', () => {
    const { query } = renderComponent({
      template: '<div>Nested property keys</div>',
    });

    expect(query('formly-template')).not.toBeNull();
    expect(query('formly-template').nativeElement.textContent).toEqual('Nested property keys');
  });
});
