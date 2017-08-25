import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormlyModule } from '../core';
import { FormlyAttributes } from './formly.attributes';
import { FormlyFieldConfig } from './formly.field.config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyAttributesElement(element: HTMLElement): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('input');
}

describe('FormlyAttributes Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FormlyModule.forRoot(),
      ],
    });
  });

  describe('templateOptions attributes', () => {
      it('should set element attribute if it is present in the templateOptions', () => {
        const fixture = createTestComponent('<input type="text" [formlyAttributes]="field">');
        const elm = getFormlyAttributesElement(fixture.nativeElement);

        expect(elm.getAttribute('placeholder')).toBe('Title');
        expect(elm.getAttribute('tabindex')).toBe('5');
        expect(elm.getAttribute('step')).toBe('2');
        expect(elm.getAttribute('name')).toBe('title-name');
        expect(elm.getAttribute('id')).toBe('title-id');
        expect(elm.getAttribute('aria-describedby')).toBe('title-id-message');
        expect(fixture.componentInstance.field.focus).toBeFalsy();
      });

      it('should change element attribute on edit templateOptions', () => {
        const fixture = createTestComponent('<input type="text" [formlyAttributes]="field">');
        const elm = getFormlyAttributesElement(fixture.nativeElement);

        fixture.componentInstance.field = {
          key: 'title',
          focus: true,
          templateOptions: {
            placeholder: 'Title Edit',
          },
        };

        fixture.detectChanges();

        expect(elm.getAttribute('placeholder')).toBe('Title Edit');
        expect(elm.getAttribute('tabindex')).toBe('');
        expect(elm.getAttribute('step')).toBe('');
        expect(fixture.componentInstance.field.focus).toBeTruthy();
      });
  });

  describe('focus the element', () => {
    it(`should focus the element when focus is set to "true" and then blurred when it's set to "false"`, () => {
      const fixture = createTestComponent('<input type="text" [formlyAttributes]="field">');
      const elm = getFormlyAttributesElement(fixture.nativeElement);

      fixture.componentInstance.field = { focus: true, templateOptions: {} };
      fixture.detectChanges();
      expect(document.activeElement === elm).toBeTruthy();

      fixture.componentInstance.field = { focus: false, templateOptions: {} };
      fixture.detectChanges();
      expect(document.activeElement === elm).toBeFalsy();
    });

    it('should change field focus when the element is focused or blurred', () => {
      const fixture = createTestComponent('<input type="text" [formlyAttributes]="field">');
      const directive = fixture.debugElement.query(By.directive(FormlyAttributes));

      directive.triggerEventHandler('focus', {});
      expect(fixture.componentInstance.field.focus).toBeTruthy();

      directive.triggerEventHandler('blur', {});
      expect(fixture.componentInstance.field.focus).toBeFalsy();
    });
  });
});

@Component({selector: 'formly-formly-attributes-test', template: '', entryComponents: []})
class TestComponent {
  field: FormlyFieldConfig = {
    focus: false,
    key: 'title',
    name: 'title-name',
    id: 'title-id',
    templateOptions: {
      placeholder: 'Title',
      'aria-describedby': true,
      tabindex: 5,
      step: 2,
    },
  };
}
