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
      expect(() => renderComponent({})).not.toThrow();
    });

    it('should extract RegExp source when setting pattern attribute', () => {
      const { query } = renderComponent({
        props: {
          pattern: /^(?! )[a-zA-Z0-9_ ()-]*(?<! )$/,
        },
      });

      const inputElm = query('input');
      expect(inputElm.attributes.pattern).toBe('(?! )[a-zA-Z0-9_ ()\\-]*(?<! )');
    });

    it('should handle pattern as a string', () => {
      const { query } = renderComponent({
        props: {
          pattern: '^[0-9]{5}$',
        },
      });

      const inputElm = query('input');
      expect(inputElm.attributes.pattern).toBe('[0-9]{5}');
    });

    it('should preserve character ranges in pattern attribute', () => {
      const { query } = renderComponent({
        props: {
          pattern: '^[a-z0-9]+$',
        },
      });

      const inputElm = query('input');
      expect(inputElm.attributes.pattern).toBe('[a-z0-9]+');
    });

    it('should escape literal edge hyphens in character classes', () => {
      const { query } = renderComponent({
        props: {
          pattern: '^[-A-Z]+$',
        },
      });

      const inputElm = query('input');
      expect(inputElm.attributes.pattern).toBe('[\\-A-Z]+');
    });

    it.each([
      [/^[\w-.]+$/, 'a.b-c', '!'],
      [/^[.-\w]+$/, 'a.b-c', '!'],
      [/^[\d-a]+$/, '12-a', 'b'],
      [/^[a-\d]+$/, '12-a', 'b'],
      [/^[\D-a]+$/, '!-a', '1'],
      [/^[a-\D]+$/, '!-a', '1'],
      [/^[\s-a]+$/, ' -a', 'b'],
      [/^[a-\s]+$/, ' -a', 'b'],
      [/^[\S-a]+$/, '1-a', ' '],
      [/^[a-\S]+$/, '1-a', ' '],
      [/^[\W-a]+$/, '!-a', '1'],
      [/^[a-\W]+$/, '!-a', '1'],
      [/^[\w\-]+$/, 'a-b', '!'],
      [/^[\\-]+$/, '\\-', 'a'],
      [/^\w-\w$/, 'a-b', 'ab'],
      [/^\[\w-.\]$/, '[a-.]', '[ab.]'],
      [/^[0-9A-Z]+$/, 'A123', 'a'],
      [/^[-A-Z]+$/, 'A-Z', 'a'],
      [/^[A-Z-]+$/, 'A-Z', 'a'],
      [/^[a-b-c]+$/, 'a-b-c', 'd'],
      [/^[a-b-c-d-e]+$/, 'a-b-c-d-e', 'f'],
      [/^[^a-b-c]+$/, 'def', 'a'],
      [/^[a-\x62-c]+$/, 'a-b-c', 'd'],
      [/^[\u0061-\u0062-c]+$/, 'a-b-c', 'd'],
      [/^[\\\-a-b-c]+$/, '\\-abc', 'd'],
      [/^[\w--a]+$/, '-a', '.'],
      ['^[a-b-c]+$', 'a-b-c', 'd'],
      ['^[a-b-c\n]+$', 'a\n-b-c', 'd'],
      [/^[😀-🙏-a]+$/u, '😀😁🙏-a', 'b'],
      [String.raw`^[\w-.]+$`, 'a.b-c', '!'],
    ])('should preserve native pattern validation for %s', (pattern, validValue, invalidValue) => {
      const { query } = renderComponent({ props: { pattern } });
      // Browsers compile HTML pattern attributes with the v flag.
      const nativePattern = new RegExp(`^(?:${query('input').attributes.pattern})$`, 'v');

      expect(nativePattern.test(validValue)).toBe(true);
      expect(nativePattern.test(invalidValue)).toBe(false);
    });
  });

  describe('props events', () => {
    it(`should mark formControl as dirty on trigger change Event`, () => {
      const { query, field } = renderComponent({
        formControl: new FormControl(),
      });

      query('input').triggerEventHandler('change', ɵCustomEvent());
      expect(field.formControl.dirty).toBe(true);
    });

    it(`should trigger props events`, () => {
      const { query, field } = renderComponent({
        props: {
          focus: vi.fn(),
          blur: vi.fn(),
          change: vi.fn(),
          keyup: vi.fn(),
          keydown: vi.fn(),
          click: vi.fn(),
          keypress: vi.fn(),
          wheel: vi.fn(),
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
      expectEventCall('wheel');
    });
  });

  describe('focus the element', () => {
    it(`should focus the element when focus is set to "true" and then blurred when it's set to "false"`, async () => {
      vi.useFakeTimers();
      const { detectChanges, query, field } = renderComponent({ focus: true });
      const inputEl = <HTMLInputElement>query('input').nativeElement;

      await vi.advanceTimersByTimeAsync(0);
      expect(document.activeElement === inputEl).toBe(true);

      field.focus = false;
      await vi.advanceTimersByTimeAsync(0);
      detectChanges();
      expect(document.activeElement === inputEl).toBe(false);
    });

    it('should change field focus when the element is focused or blurred', () => {
      const { query, field } = renderComponent({ focus: false });

      query('input').triggerEventHandler('focus', {});
      expect(field.focus).toBe(true);

      query('input').triggerEventHandler('blur', {});
      expect(field.focus).toBe(false);
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

    it(`should focus the first element when mutliple formlyAttributes is present`, async () => {
      vi.useFakeTimers();
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
      await vi.advanceTimersByTimeAsync(0);
      detectChanges();
      expect(document.activeElement === query('input').nativeElement).toBe(true);
    });
  });
});
