import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlySelectModule } from '@ngx-formly/ionic/select';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlySelectModule],
  });
};

describe('ui-ionic: Select Type', () => {
  it('should pass interface options to the select and update them', () => {
    const interfaceOptions = { size: 'cover', cssClass: 'custom-popover' };
    const { field, query, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        interface: 'popover',
        interfaceOptions,
        options: [{ value: 1, label: 'label 1' }],
      },
    });
    const select = query<HTMLIonSelectElement>('ion-select').nativeElement;

    expect(select.interfaceOptions).toBe(interfaceOptions);

    field.props.interfaceOptions = { header: 'Choose an option' };
    field.options.detectChanges(field);
    detectChanges();
    expect(select.interfaceOptions).toBe(field.props.interfaceOptions);
  });

  it('should render select type', () => {
    const { query, queryAll } = renderComponent({
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

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();
    expect(queryAll('ion-select-option')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'enum',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();
    expect(queryAll('ion-select-option')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        change: changeSpy,
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const radioEl = query<HTMLIonSelectElement>('ion-select').nativeElement;
    radioEl.value = 1;
    query('ion-select').triggerEventHandler('ionChange', ɵCustomEvent(radioEl));
    detectChanges();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });
});
