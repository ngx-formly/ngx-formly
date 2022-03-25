import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createComponent, ɵCustomEvent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig, { template }: { template?: string } = {}) => {
  return createComponent<{ field: FormlyFieldConfig }>({
    template: template || '<input type="text" [formlyAttributes]="field">',
    inputs: { field },
  });
};

describe('FormlyAttributes Component', () => {
  describe('props attributes', () => {
    it('should set built-in attributes if present', () => {
      const { query } = renderComponent({
        name: 'title-name',
        id: 'title-id',
        props: {
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
        props: {
          placeholder: 'Title',
          required: true,
          disabled: true,
          tabindex: 5,
          step: 2,
        },
      });
      expect(query('input').attributes).toMatchObject({
        placeholder: 'Title',
        tabindex: '5',
        step: '2',
      });

      setInputs({
        field: {
          key: 'title',
          props: {
            placeholder: 'Title Edit',
          },
        },
      });

      expect(query('input').attributes).toMatchObject({
        placeholder: 'Title Edit',
      });
    });

    it('should ignore handle attr if already set', () => {
      const { query } = renderComponent(
        {},
        {
          template: `<input type="text" [attr.disabled]="'disabled'" [formlyAttributes]="field">`,
        },
      );

      const inputElm = query('input');
      expect(inputElm.attributes.disabled).toBe('disabled');
    });

    it('should handle readonly attribute', () => {
      const { detectChanges, query, field } = renderComponent({
        props: { readonly: true },
      });

      const inputElm = query('input');
      expect(inputElm.attributes.readonly).toBe('readonly');
      field.props.readonly = false;
      detectChanges();
      expect(inputElm.attributes.readonly).toBe(undefined);
    });

    it('should allow overriding the default build-in attributes', () => {
      const { query } = renderComponent({
        props: {
          min: 5,
          max: 10,
          attributes: { max: null },
        },
      });
      const inputElm = query('input');

      expect(inputElm.attributes.min).toBe('5');
      expect(inputElm.attributes.max).toBeUndefined();
    });

    it('should set attributes from props attributes', () => {
      const { query } = renderComponent({
        props: { attributes: { min: 5, max: 10 } },
      });

      expect(query('input').attributes).toMatchObject({
        min: '5',
        max: '10',
      });
    });

    it('should handle edit props attributes', () => {
      const { query, field } = renderComponent({
        props: { attributes: { min: 5, max: 10 } },
      });

      expect(query('input').attributes).toMatchObject({
        min: '5',
        max: '10',
      });

      field.props.attributes = {
        style: 'background: green',
      };

      expect(query('input').attributes).toMatchObject({ style: 'background: green' });
    });

    it('should not fail without props', () => {
      expect(() => renderComponent({})).not.toThrowError();
    });
  });

  describe('props events', () => {
    it(`should mark formControl as dirty on trigger change Event`, () => {
      const { query, field } = renderComponent({
        formControl: new FormControl(),
      });

      query('input').triggerEventHandler('change', ɵCustomEvent());
      expect(field.formControl.dirty).toBeTrue();
    });

    it(`should trigger props events`, () => {
      const { query, field } = renderComponent({
        props: {
          focus: jest.fn(),
          blur: jest.fn(),
          change: jest.fn(),
          keyup: jest.fn(),
          keydown: jest.fn(),
          click: jest.fn(),
          keypress: jest.fn(),
        },
      });

      const expectEventCall = (evt: string) => {
        query('input').triggerEventHandler(evt, {});
        expect(field.props[evt]).toHaveBeenCalledWith(field, expect.any(Object));
      };

      expectEventCall('focus');
      expectEventCall('blur');
      expectEventCall('change');
      expectEventCall('keyup');
      expectEventCall('keydown');
      expectEventCall('click');
      expectEventCall('keypress');
    });
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

    it(`should set id to the first element only when mutliple formlyAttributes is present`, () => {
      const { queryAll } = renderComponent(
        { id: 'title-id' },
        {
          template: `
            <input type="text" [formlyAttributes]="field">
            <input type="text" [formlyAttributes]="field">
          `,
        },
      );
      const inputs = queryAll('input');
      expect(inputs[0].attributes.id).toEqual('title-id');
      expect(inputs[1].attributes.id).toEqual(undefined);
    });

    it(`should not set field id when id input is present`, () => {
      const { query } = renderComponent(
        { id: 'title-id' },
        {
          template: `
            <input [id]="'foo'" type="text" [formlyAttributes]="field">
          `,
        },
      );
      expect(query('input').attributes.id).toEqual('foo');
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
