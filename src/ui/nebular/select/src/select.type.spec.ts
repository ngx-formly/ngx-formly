import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyNebularSelectModule } from '@ngx-formly/nebular/select';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { NbSelectComponent, NbThemeModule } from '@nebular/theme';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyNebularSelectModule, NbThemeModule.forRoot()],
  });
};

describe('ui-nebular: Select Type', () => {
  it('should render select type', async () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect((query('nb-select').componentInstance as NbSelectComponent).options.length).toBe(3);
  });

  it('should render enum type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect((query('nb-select').componentInstance as NbSelectComponent).options.length).toBe(3);
  });
});
