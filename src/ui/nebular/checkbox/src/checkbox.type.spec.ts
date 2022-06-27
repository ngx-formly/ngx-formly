import { NbThemeModule } from '@nebular/theme';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyNebularCheckboxModule } from '@ngx-formly/nebular/checkbox';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyNebularCheckboxModule, NbThemeModule.forRoot()],
  });
};

describe('ui-nebular: Checkbox Type', () => {
  it('should render checkbox type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'checkbox',
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();

    const { attributes } = query('nb-checkbox');
    expect(attributes).toMatchObject({
      class: 'status-info ng-untouched ng-pristine ng-valid',
    });
    expect(query('input[type="checkbox"]').properties).toMatchObject({
      indeterminate: true,
    });
  });

  it('should render boolean type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'boolean',
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();

    const { attributes } = query('nb-checkbox');
    expect(attributes).toMatchObject({
      class: 'status-info ng-untouched ng-pristine ng-valid',
    });
    expect(query('input[type="checkbox"]').properties).toMatchObject({
      indeterminate: true,
    });
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'checkbox',
      props: { checkChanged: changeSpy },
    });

    const input = query('nb-checkbox > label > span.custom-checkbox').nativeElement as HTMLInputElement;
    input.click();
    detectChanges();
    expect(field.formControl.value).toBeTrue();
    expect(changeSpy).toHaveBeenCalledOnce();

    input.click();
    detectChanges();
    expect(field.formControl.value).toBeFalse();
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });
});
