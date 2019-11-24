import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createComponent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig, { template }: { template?: string } = {}) => {
  return createComponent<{ field: FormlyFieldConfig }>({
    template: template || '<input type="text" [formlyAttributes]="field">',
    inputs: { field },
  });
};

describe('FormlyAttributes Component', () => {
  describe('templateOptions attributes', () => {
    it('should set built-in attributes if present', () => {
      const { query } = renderComponent({
        name: 'title-name',
        id: 'title-id',
        templateOptions: {
          placeholder: 'Title',
          required: true,
          disabled: true,
          tabindex: 5,
          step: 2,
        },
      });

      expect(query('input').attributes).toMatchObject({
        name: 'title-name',
        id: 'title-id',
        type: 'text',
        placeholder: 'Title',
        disabled: 'disabled',
        required: 'required',
        tabindex: '5',
        step: '2',
      });
    });

    it('should handle built-in attributes changes', () => {
      const { query, setInputs } = renderComponent({
        name: 'title-name',
        id: 'title-id',
        templateOptions: {
          placeholder: 'Title',
          required: true,
          disabled: true,
          tabindex: 5,
          step: 2,
        },
      });
      setInputs({
        field: {
          key: 'title',
          templateOptions: {
            placeholder: 'Title Edit',
          },
        },
      });

      expect(query('input').attributes).toMatchObject({
        placeholder: 'Title Edit',
        step: null,
        tabindex: null,
      });
    });

    it('should handle readonly attribute', () => {
      const { detectChanges, query, field } = renderComponent({
        templateOptions: { readonly: true },
      });

      const { attributes } = query('input');
      expect(attributes.readonly).toBe('readonly');
      field.templateOptions.readonly = false;
      detectChanges();
      expect(attributes.readonly).toBe(null);
    });

    it('should set attributes from templateOptions attributes', () => {
      const { query } = renderComponent({
        templateOptions: { attributes: { min: 5, max: 10 } },
      });

      expect(query('input').attributes).toMatchObject({
        min: 5,
        max: 10,
      });
    });

    it('should handle edit templateOptions attributes', () => {
      const { query, field } = renderComponent({
        templateOptions: { attributes: { min: 5, max: 10 } },
      });

      field.templateOptions.attributes = {
        style: 'background: green',
      };

      expect(query('input').attributes).toMatchObject({
        style: 'background: green',
        min: null,
        max: null,
      });
    });

    it('should not fail without templateOptions', () => {
      expect(() => renderComponent({})).not.toThrowError();
    });
  });

  it(`should mark formControl as dirty on trigger change Event`, () => {
    const { query, field } = renderComponent({
      formControl: new FormControl(),
    });

    query('input').triggerEventHandler('change', {});
    expect(field.formControl.dirty).toBeTrue();
  });

  it(`should trigger templateOptions events`, () => {
    const { query, field } = renderComponent({
      templateOptions: {
        focus: () => {},
        blur: () => {},
        change: () => {},
        keyup: () => {},
        keydown: () => {},
        click: () => {},
        keypress: () => {},
      },
    });

    const expectEventCall = (evt: string) => {
      jest.spyOn(field.templateOptions, evt);
      query('input').triggerEventHandler(evt, {});
      expect(field.templateOptions[evt]).toHaveBeenCalledWith(field, expect.any(Object));
    };

    expectEventCall('focus');
    expectEventCall('blur');
    expectEventCall('change');
    expectEventCall('keyup');
    expectEventCall('keydown');
    expectEventCall('click');
    expectEventCall('keypress');
  });

  describe('focus the element', () => {
    it(`should focus the element when focus is set to "true" and then blurred when it's set to "false"`, () => {
      const { detectChanges, query, field } = renderComponent({ focus: true });
      const inputEl = <HTMLInputElement>query('input').nativeElement;

      expect(document.activeElement === inputEl).toBeTrue();

      field.focus = false;
      detectChanges();
      expect(document.activeElement === inputEl).toBeFalse();
    });

    it('should change field focus when the element is focused or blurred', () => {
      const { query, field } = renderComponent({ focus: false });

      query('input').triggerEventHandler('focus', {});
      expect(field.focus).toBeTrue();

      query('input').triggerEventHandler('blur', {});
      expect(field.focus).toBeFalse();
    });

    it(`should focus the first element when mutliple formlyAttributes is present`, () => {
      const { detectChanges, field, query } = renderComponent(
        { focus: true },
        {
          template: `
            <input type="text" [formlyAttributes]="field">
            <input type="text" [formlyAttributes]="field">
            <input type="text" [formlyAttributes]="field">
          `,
        },
      );

      field.focus = true;
      detectChanges();
      expect(document.activeElement === query('input').nativeElement).toBeTrue();
    });
  });
});
