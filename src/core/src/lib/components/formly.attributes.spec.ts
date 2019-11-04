import { By } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyAttributes } from './formly.attributes';
import { createComponent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig, { template }: { template?: string } = {}) => {
  return createComponent<{ field: FormlyFieldConfig }>({
    template: template || '<input type="text" [formlyAttributes]="field">',
    inputs: { field },
  });
};

function getFormlyAttributesElement(element: HTMLElement): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('input');
}

describe('FormlyAttributes Component', () => {
  describe('templateOptions attributes', () => {
    it('should set built-in attributes if present', () => {
      const fixture = renderComponent({
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
      const elm = getFormlyAttributesElement(fixture.nativeElement);

      expect(elm.getAttribute('name')).toBe('title-name');
      expect(elm.getAttribute('id')).toBe('title-id');
      expect(elm.getAttribute('placeholder')).toBe('Title');
      expect(elm.getAttribute('disabled')).toBe('disabled');
      expect(elm.getAttribute('required')).toBe('required');
      expect(elm.getAttribute('tabindex')).toBe('5');
      expect(elm.getAttribute('step')).toBe('2');
    });

    it('should handle built-in attributes changes', () => {
      const fixture = renderComponent({
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
      const elm = getFormlyAttributesElement(fixture.nativeElement);

      fixture.componentInstance.field = {
        key: 'title',
        templateOptions: {
          placeholder: 'Title Edit',
        },
      };
      fixture.detectChanges();

      expect(elm.getAttribute('placeholder')).toBe('Title Edit');
      expect(elm.getAttribute('tabindex')).toBeNull();
      expect(elm.getAttribute('step')).toBeNull();
    });

    it('should handle readonly attribute', () => {
      const fixture = renderComponent({
        templateOptions: { readonly: true },
      });
      const elm = getFormlyAttributesElement(fixture.nativeElement);

      expect(elm.getAttribute('readonly')).toBe('readonly');
      fixture.componentInstance.field.templateOptions.readonly = false;
      fixture.detectChanges();
      expect(elm.getAttribute('readonly')).toBe(null);
    });

    it('should set attributes from templateOptions attributes', () => {
      const fixture = renderComponent({
        templateOptions: { attributes: { min: 5, max: 10 } },
      });

      const elm = getFormlyAttributesElement(fixture.nativeElement);
      expect(elm.getAttribute('min')).toEqual('5');
      expect(elm.getAttribute('max')).toEqual('10');
    });

    it('should handle edit templateOptions attributes', () => {
      const fixture = renderComponent({
        templateOptions: { attributes: { min: 5, max: 10 } },
      });

      const elm = getFormlyAttributesElement(fixture.nativeElement);
      fixture.componentInstance.field.templateOptions.attributes = {
        style: 'background: green',
      };

      expect(elm.getAttribute('style')).toBe('background: green');
      expect(elm.getAttribute('min')).toEqual(null);
      expect(elm.getAttribute('max')).toEqual(null);
    });

    it('should not fail without templateOptions', () => {
      const fixture = renderComponent({});

      const elm = getFormlyAttributesElement(fixture.nativeElement);
      expect(elm.getAttribute('tabindex')).toBeNull();
    });
  });

  it(`should mark formControl as dirty on trigger change Event`, () => {
    const fixture = renderComponent({
      formControl: new FormControl(),
    });
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('change', {});

    const formControl = fixture.componentInstance.field.formControl;
    expect(formControl.dirty).toBeTruthy();
  });

  describe('focus the element', () => {
    it(`should focus the element when focus is set to "true" and then blurred when it's set to "false"`, () => {
      const fixture = renderComponent({ focus: true });
      const elm = getFormlyAttributesElement(fixture.nativeElement);

      expect(document.activeElement === elm).toBeTruthy();

      fixture.componentInstance.field.focus = false;
      fixture.detectChanges();
      expect(document.activeElement === elm).toBeFalsy();
    });

    it('should change field focus when the element is focused or blurred', () => {
      const fixture = renderComponent({ focus: false });
      const directive = fixture.debugElement.query(By.directive(FormlyAttributes));

      directive.triggerEventHandler('focus', {});
      expect(fixture.componentInstance.field.focus).toBeTruthy();

      directive.triggerEventHandler('blur', {});
      expect(fixture.componentInstance.field.focus).toBeFalsy();
    });

    it(`should focus the first element when mutliple formlyAttributes is present`, () => {
      const fixture = renderComponent(
        { focus: true },
        {
          template: `
            <input type="text" [formlyAttributes]="field">
            <input type="text" [formlyAttributes]="field">
            <input type="text" [formlyAttributes]="field">
          `,
        },
      );
      const elm = getFormlyAttributesElement(fixture.nativeElement);

      fixture.componentInstance.field.focus = true;
      fixture.detectChanges();
      expect(document.activeElement === elm).toBeTruthy();
    });
  });
});
