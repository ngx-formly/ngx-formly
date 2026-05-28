import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyBootstrapMultiCheckboxModule } from '@ngx-formly/bootstrap/multicheckbox';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapMultiCheckboxModule],
  });
};

describe('ui-bootstrap: MultiCheckbox Type', () => {
  it('should render multicheckbox type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'multicheckbox',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('input[type="checkbox"]')).toHaveLength(3);
  });

  it('should add "is-invalid" class and set aria-invalid to be true on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'multicheckbox',
      validation: { show: true },
      props: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('input[type="checkbox"]').classes['is-invalid']).toBeTrue();
    expect(query('input[type="checkbox"]').nativeElement.getAttribute('aria-invalid')).toBe('true');
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, queryAll, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'multicheckbox',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
        change: changeSpy,
      },
    });
    query('input[type="checkbox"]').triggerEventHandler('change', ɵCustomEvent({ checked: true }));
    detectChanges();
    expect(field.formControl.value).toEqual({ '1': true });
    expect(changeSpy).toHaveBeenCalledOnce;

    queryAll('input[type="checkbox"]').forEach((x) => {
      x.triggerEventHandler('change', ɵCustomEvent({ checked: true }));
      detectChanges();
    });

    expect(field.formControl.value).toEqual({ '1': true, '2': true, '3': true });
    expect(changeSpy).toHaveBeenCalledTimes(4);

    query('input[type="checkbox"]').triggerEventHandler('change', ɵCustomEvent({ checked: false }));
    detectChanges();
    expect(field.formControl.value).toEqual({ '1': false, '2': true, '3': true });
    expect(changeSpy).toHaveBeenCalledOnce;
  });
});
