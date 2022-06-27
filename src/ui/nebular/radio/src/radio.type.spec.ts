import { NbThemeModule } from '@nebular/theme';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyNebularRadioModule } from '@ngx-formly/nebular/radio';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyNebularRadioModule, NbThemeModule.forRoot()],
  });
};

describe('ui-nebular: Radio Type', () => {
  it('should render radio type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('input[type="radio"]')).toHaveLength(3);
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'radio',
      validation: { show: true },
      props: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('nb-radio-group').classes['ng-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    (query('input[type="radio"]').nativeElement as HTMLElement).click();
    detectChanges();
    expect(field.formControl.value).toEqual(1);
  });
});
