import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyFormFieldModule } from '@ngx-formly/ionic/form-field';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyFormFieldModule],
  });
};

describe('ui-ionic: FormField Wrapper', () => {
  it('should render form-field wrapper', () => {
    const { query } = renderComponent({
      wrappers: ['form-field'],
      props: {
        label: 'Name',
        required: true,
      },
    });

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();

    // Label + Required marker
    expect(query('ion-item ion-label').nativeElement.textContent).toEqual(' Name *');
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

    expect(query('ion-item ion-label').nativeElement.textContent).toEqual(' Name ');
  });
});
