import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyMatRadioModule } from '@ngx-formly/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyMatRadioModule],
  });
};

describe('ui-material: Radio Type', () => {
  it('should render radio type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'radio',
      templateOptions: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();
    expect(queryAll('input[type="radio"]')).toHaveLength(3);
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'radio',
      validation: { show: true },
      templateOptions: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('mat-radio-group').classes['ng-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      templateOptions: {
        change: changeSpy,
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const evt = { stopPropagation: () => {} };
    query('input[type="radio"]').triggerEventHandler('change', evt);
    detectChanges();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
