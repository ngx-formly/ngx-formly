import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyBootstrapFormFieldModule } from '@ngx-formly/bootstrap/form-field';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapFormFieldModule],
  });
};

describe('ui-bootstrap: FormField Wrapper', () => {
  it('should render form-field wrapper', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      props: {
        label: 'Name',
        required: true,
        description: 'Name description',
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();

    // Label + Required marker
    expect(query('label').nativeElement.textContent).toEqual(' Name *');
    // Description
    expect(query('small.form-text').nativeElement.textContent).toEqual('Name description');
  });

  it('should show error message', () => {
    const { query } = renderComponent({
      key: 'name',
      wrappers: ['form-field'],
      validation: { show: true },
      props: {
        label: 'Name',
        required: true,
      },
    });

    expect(query('div.has-error')).not.toBeNull();
    expect(query('formly-validation-message')).not.toBeNull();
  });

  it('should hide required marker', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      props: {
        label: 'Name',
        hideRequiredMarker: true,
        required: true,
      },
    });

    expect(query('label').nativeElement.textContent).toEqual(' Name ');
  });

  it('shows multiple messages after touch while preserving the error ID and alert role', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      wrappers: ['form-field'],
      validation: { showAllErrors: true },
      validators: {
        first: { expression: () => false, message: 'First error.' },
        second: { expression: () => false, message: 'Second error.' },
      },
    });
    expect(query('formly-validation-message')).toBeNull();

    field.formControl.markAsTouched();
    detectChanges();
    const message = query('formly-validation-message').nativeElement;
    expect(message.textContent).toBe('First error.\nSecond error.');
    expect(message.id).toBe(`${field.id}-formly-validation-error`);
    expect(message.getAttribute('role')).toBe('alert');
  });

  it('should hide label', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      props: {
        label: 'Name',
        hideLabel: true,
      },
    });

    expect(query('label')).toBeNull();
  });
});
