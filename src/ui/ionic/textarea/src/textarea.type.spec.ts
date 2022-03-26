import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyTextAreaModule } from '@ngx-formly/ionic/textarea';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyTextAreaModule],
  });
};

describe('ui-ionic: Textarea Type', () => {
  it('should render textarea type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      props: {
        cols: 5,
        rows: 7,
      },
    });

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();
    const { attributes } = query('ion-textarea');
    expect(attributes).toMatchObject({
      id: 'formly_1_textarea_name_0',
    });
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'textarea',
      validation: { show: true },
      props: { required: true },
    });

    expect(query('ion-textarea').classes['ng-invalid']).toBeTrue();
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, field } = renderComponent({
      key: 'name',
      type: 'textarea',
      props: { change: changeSpy },
    });

    const inputEl = query<HTMLTextAreaElement>('ion-textarea').nativeElement;
    inputEl.value = 'foo';
    query('ion-textarea').triggerEventHandler('ionChange', ɵCustomEvent(inputEl));
    expect(field.formControl.value).toEqual('foo');
    expect(changeSpy).toHaveBeenCalledOnce();
  });
});
