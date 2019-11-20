import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyNzFormFieldModule],
  });
};

describe('ui-ng-zorro-antd: FormField Wrapper', () => {
  it('should render form-field wrapper', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      templateOptions: {
        label: 'Name',
        required: true,
      },
    });

    expect(query('formly-wrapper-nz-form-field')).not.toBeNull();

    // Label
    expect(query('label').nativeElement.textContent).toEqual(' Name ');
    // Required marker
    expect(query('label.ant-form-item-required')).not.toBeNull();
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

    expect(query('label.ant-form-item-required')).toBeNull();
  });

  it('should hide label', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      templateOptions: {
        label: 'Name',
        hideLabel: true,
      },
    });

    expect(query('label')).toBeNull();
  });
});
