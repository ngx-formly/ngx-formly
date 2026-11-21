import { FormlyBootstrapMultiCheckboxModule } from '@ngx-formly/bootstrap/multicheckbox';
import { FormlyBootstrapRadioModule } from '@ngx-formly/bootstrap/radio';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createComponent, createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapRadioModule],
  });
};

describe('ui-bootstrap: Radio Type', () => {
  it.each(['radio', 'multicheckbox'])('keeps keyboard focus on a %s when a sibling rebuilds', (type) => {
    const sibling: FormlyFieldConfig = { key: 'sibling', fieldGroup: [] };
    const { query, detectChanges } = createComponent({
      template: '<formly-form [fields]="fields"></formly-form>',
      inputs: { fields: [{ key: 'choice', type, props: { options: [{ label: 'One', value: 1 }] } }, sibling] },
      imports: [FormlyBootstrapRadioModule, FormlyBootstrapMultiCheckboxModule],
    });
    const input = query<HTMLInputElement>('input').nativeElement;
    input.focus();
    expect(document.activeElement).toBe(input);

    sibling.options.build(sibling);
    detectChanges();
    expect(query('input').nativeElement).toBe(input);
    expect(document.activeElement).toBe(input);
  });

  it.each(['radio', 'multicheckbox'])(
    'keeps focus on the same %s choice when equal-valued source choices reorder',
    (type) => {
      const options = [
        { label: 'One', value: 1 },
        { label: 'Two', value: 1 },
      ];
      const field: FormlyFieldConfig = {
        key: 'choice',
        type,
        props: { options, mapProp: (option) => ({ ...option }) },
      };
      const { queryAll, detectChanges } = createComponent({
        template: '<formly-form [fields]="fields"></formly-form>',
        inputs: { fields: [field] },
        imports: [FormlyBootstrapRadioModule, FormlyBootstrapMultiCheckboxModule],
      });
      const inputs = () => queryAll<HTMLInputElement>('input').map(({ nativeElement }) => nativeElement);
      const first = inputs()[0];
      first.focus();

      options.reverse();
      field.options.build();
      detectChanges();
      expect(inputs()[1]).toBe(first);
      expect(document.activeElement).toBe(first);
    },
  );

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

  it('should add "is-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'radio',
      validation: { show: true },
      props: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('input[type="radio"]').classes['is-invalid']).toBe(true);
  });

  it('should set aria-invalid to true on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'radio',
      validation: { show: true },
      props: {
        options: [{ value: 1, label: 'label 1' }],
        required: true,
      },
    });

    expect(query('input[type="radio"]').nativeElement.getAttribute('aria-invalid')).toBe('true');
  });

  it('should render with custom formCheck', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        formCheck: 'default',
        options: [{ value: 1, label: 'label 1' }],
      },
    });

    const formCheckElm = query('div.form-check');

    // 'default'
    expect(formCheckElm).not.toBeNull();

    // 'inline'
    field.props.formCheck = 'inline';
    detectChanges();
    expect(formCheckElm.classes).toEqual({
      'form-check': true,
      'form-check-inline': true,
    });
  });

  it('should bind control value on change', () => {
    const changeSpy = vi.fn();
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'radio',
      props: {
        options: [{ value: 1, label: 'label 1' }],
        change: changeSpy,
      },
    });

    query('input[type="radio"]').triggerEventHandler('change', ɵCustomEvent());
    detectChanges();
    expect(field.formControl.value).toEqual(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });
});
