import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyRadioModule } from '@ngx-formly/ionic/radio';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyRadioModule],
  });
};

describe('ui-ionic: Radio Type', () => {
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

    expect(query('formly-wrapper-ion-form-field')).toBeNull();
    expect(queryAll('ion-radio')).toHaveLength(3);
  });

  it('should show error message', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'radio',
      validation: { show: true },
      props: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('ion-radio-group').classes['ng-invalid']).toBeTrue();
    expect(query('formly-validation-message')).not.toBeNull();
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        change: changeSpy,
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const radioEl = query<HTMLIonRadioElement>('ion-radio-group').nativeElement;
    radioEl.value = 1;
    query('ion-radio-group').triggerEventHandler('ionChange', ɵCustomEvent(radioEl));
    detectChanges();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
