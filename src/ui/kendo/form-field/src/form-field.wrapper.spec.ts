import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyFormFieldModule],
  });
};

describe('ui-kendo: FormField Wrapper', () => {
  it('should render form-field wrapper', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      templateOptions: {
        label: 'Name',
        required: true,
      },
    });

    expect(query('formly-wrapper-kendo-form-field')).not.toBeNull();
    expect(query('label').nativeElement.textContent.trim()).toEqual('Name *');
  });

  it('should show error message', () => {
    const { query } = renderComponent({
      key: 'name',
      wrappers: ['form-field'],
      validation: { show: true },
      templateOptions: {
        label: 'Name',
        required: true,
      },
    });

    expect(query('formly-validation-message')).not.toBeNull();
  });

  it('should hide required marker', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      templateOptions: {
        label: 'Name',
        hideRequiredMarker: true,
        required: true,
      },
    });

    expect(query('label').nativeElement.textContent.trim()).toEqual('Name');
  });

  it('should hide label', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      templateOptions: {
        label: 'Name',
        hideLabel: true,
      },
    });

    expect(query('label > span')).toBeNull();
  });
});
