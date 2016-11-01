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
        expect(fixture.componentInstance.field.templateOptions.focus).toBeFalsy();
      });

      it('should change element attribute on edit templateOptions', () => {
        const fixture = createTestComponent('<input type="text" [formlyAttributes]="field">');
        const elm = getFormlyAttributesElement(fixture.nativeElement);

        fixture.componentInstance.field = {
          key: 'title',
          templateOptions: {
            placeholder: 'Title Edit',
            focus: true,
          },
        };

        fixture.detectChanges();

        expect(elm.getAttribute('placeholder')).toBe('Title Edit');
        expect(elm.getAttribute('tabindex')).toBe(null);
        expect(elm.getAttribute('step')).toBe(null);
        expect(fixture.componentInstance.field.templateOptions.focus).toBeTruthy();
      });
  });

  describe('focus the element', () => {
    it(`should focus the element when focus is set to "true" and then blurred when it's set to "false"`, () => {
      const fixture = createTestComponent('<input type="text" [formlyAttributes]="field">');
      const elm = getFormlyAttributesElement(fixture.nativeElement);

      fixture.componentInstance.field = { templateOptions: { focus: true } };
      fixture.detectChanges();
      expect(document.activeElement === elm).toBeTruthy();

      fixture.componentInstance.field = { templateOptions: { focus: false } };
      fixture.detectChanges();
      expect(document.activeElement === elm).toBeFalsy();
    });

    it('should change templateOptions focus when the element is focused', () => {
      const fixture = createTestComponent('<input type="text" [formlyAttributes]="field">');
      const directive = fixture.debugElement.query(By.directive(FormlyAttributes));

      directive.triggerEventHandler('focus', {});
      fixture.detectChanges();

      expect(fixture.componentInstance.field.templateOptions.focus).toBeTruthy();
    });
  });
});

@Component({selector: 'formly-formly-attributes-test', template: '', entryComponents: []})
class TestComponent {
  field: FormlyFieldConfig = {
    key: 'title',
    templateOptions: {
      placeholder: 'Title',
      tabindex: 5,
      step: 2,
      focus: false,
    },
  };
}
