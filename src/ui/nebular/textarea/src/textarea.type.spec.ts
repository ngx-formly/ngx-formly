import { NbThemeModule } from '@nebular/theme';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyNebularTextareaModule } from '@ngx-formly/nebular/textarea';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyNebularTextareaModule, NbThemeModule.forRoot()],
  });
};

describe('ui-nebular: Textarea Type', () => {
  it('should render textarea type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      props: {
        cols: 5,
        rows: 7,
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    const { properties, attributes } = query('textarea');
    expect(properties).toMatchObject({
      cols: 5,
      rows: 7,
    });
    expect(attributes).toMatchObject({
      id: 'formly_1_textarea_name_0',
    });
  });
});
