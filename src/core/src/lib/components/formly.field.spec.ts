import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyModule,
  FieldType,
  FieldWrapper,
} from '../core';
import { By } from '@angular/platform-browser';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyFieldElement(element: HTMLElement): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('formly-field');
}

function getInputField(element: HTMLElement, index = 0): HTMLInputElement {
  return <HTMLInputElement>element.querySelectorAll('input')[index];
}

function getLabelWrapper(element: HTMLElement): HTMLElement {
  return <HTMLElement>element.querySelector('label');
}

let testComponentInputs;

describe('FormlyField Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormlyFieldText,
        FormlyWrapperLabel,
        AsyncWrapperComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'text',
              component: FormlyFieldText,
            },
            {
              name: 'other',
              component: FormlyFieldText,
              wrappers: ['label'],
            },
          ],
          wrappers: [
            {
              name: 'label',
              component: FormlyWrapperLabel,
            },
            {
              name: 'async_render',
              component: AsyncWrapperComponent,
            },
          ],
          manipulators: [
            { class: Manipulator, method: 'run' },
          ],
        }),
      ],
    });
  });

  xit('should render template option', () => {
    testComponentInputs = {
      field: { template: '<div>Nested property keys</div>', hooks: {} },
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');

    expect(fixture.nativeElement.innerText).toEqual('Nested property keys');
  });

  describe('host attrs', () => {
      it('should set style and class attrs on first render', () => {
        testComponentInputs = {
          field: {
            hide: true,
            className: 'foo',
          },
        };

        const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
        const formlyField = fixture.debugElement.query(By.css('formly-field'));

        expect(formlyField.attributes.class).toEqual('foo');
        expect(formlyField.styles).toEqual({ display: 'none' });
      });

      it('should update style and class attrs on change', () => {
        testComponentInputs = {
          field: {},
        };

        const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
        const formlyField = fixture.debugElement.query(By.css('formly-field'));

        expect(formlyField.attributes.class).toEqual(undefined);
        expect(formlyField.styles).toEqual({});

        testComponentInputs.field.hide = true;
        testComponentInputs.field.className = 'foo';

        expect(formlyField.attributes.class).toEqual('foo');
        expect(formlyField.styles).toEqual({ display: 'none' });
      });

      it('should not override existing class', () => {
        testComponentInputs = {
          field: {},
        };

        const fixture = createTestComponent('<formly-field class="foo" [field]="field"></formly-field>');
        const formlyField = fixture.debugElement.query(By.css('formly-field'));

        expect(formlyField.attributes.class).toEqual('foo');
      });

  });

  it('should call field hooks if set', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        formControl: new FormControl(),
        parent: {
          formControl: new FormGroup({}),
        },
        hooks: {
          afterContentInit: () => {},
          afterContentChecked: () => {},
          afterViewInit: () => {},
          afterViewChecked: () => {},
          doCheck: () => {},
          onInit: () => {},
          onChanges: () => {},
          onDestroy: () => {},
        },
      },
    };

    const hooks = testComponentInputs.field.hooks;
    spyOn(hooks, 'afterContentInit');
    spyOn(hooks, 'afterContentChecked');
    spyOn(hooks, 'afterViewInit');
    spyOn(hooks, 'afterViewChecked');
    spyOn(hooks, 'doCheck');
    spyOn(hooks, 'onInit');
    spyOn(hooks, 'onChanges');
    spyOn(hooks, 'onDestroy');

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
    fixture.destroy();

    expect(hooks.afterContentInit).toHaveBeenCalledWith(testComponentInputs.field);
    expect(hooks.afterContentChecked).toHaveBeenCalledWith(testComponentInputs.field);
    expect(hooks.afterViewInit).toHaveBeenCalledWith(testComponentInputs.field);
    expect(hooks.afterViewChecked).toHaveBeenCalledWith(testComponentInputs.field);
    expect(hooks.doCheck).toHaveBeenCalledWith(testComponentInputs.field);
    expect(hooks.onInit).toHaveBeenCalledWith(testComponentInputs.field);
    expect(hooks.onChanges).toHaveBeenCalledWith(testComponentInputs.field);
    expect(hooks.onDestroy).toHaveBeenCalledWith(testComponentInputs.field);
  });

  it('should support async render field type', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        wrappers: ['async_render'],
        hooks: {
          onInit: f => f.formControl = new FormControl(),
        },
        templateOptions: {
          placeholder: 'Title',
          render: true,
        },
      },
      form: new FormGroup({}),
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
    expect(getInputField(fixture.nativeElement)).toBeDefined();

    fixture.componentInstance.field.templateOptions.render = false;
    fixture.detectChanges();
    expect(getInputField(fixture.nativeElement)).toBeUndefined();
  });

  it('should render field type', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        formControl: new FormControl(),
        lifecycle: {},
        templateOptions: {
          placeholder: 'Title',
        },
      },
      form: new FormGroup({}),
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');

    expect(getLabelWrapper(fixture.nativeElement)).toEqual(null);
    expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual(null);
    expect(getInputField(fixture.nativeElement).getAttribute('placeholder')).toEqual('Title');
  });

  it('should render fieldGroup', () => {
    testComponentInputs = {
      field: {
        type: 'formly-group',
        lifecycle: {},
        fieldGroup: [
          {
            key: 'title1',
            type: 'text',
            formControl: new FormControl(),
            lifecycle: {},
            templateOptions: { placeholder: 'Title1' },
          },
          {
            key: 'title2',
            type: 'text',
            formControl: new FormControl(),
            lifecycle: {},
            templateOptions: { placeholder: 'Title2' },
          },
        ],
      },
      form: new FormGroup({}),
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');

    expect(getInputField(fixture.nativeElement, 0).getAttribute('placeholder')).toEqual('Title1');
    expect(getInputField(fixture.nativeElement, 1).getAttribute('placeholder')).toEqual('Title2');
  });

  describe('wrapper', () => {
    beforeEach(() => {
      testComponentInputs = {
        field: {
          key: 'title',
          type: 'text',
          lifecycle: {},
          templateOptions: {
            label: 'Title',
            placeholder: 'Title',
          },
        },
        form: new FormGroup({ title: new FormControl() }),
      };
      testComponentInputs.field.formControl = testComponentInputs.form.get('title');
    });

    it('should render field without wrapper or key', () => {
      delete testComponentInputs.field.key;

      const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
      const elm = getFormlyFieldElement(fixture.nativeElement);
      expect(getInputField(elm)).toBeDefined();
    });

    it('should render field wrapper', () => {
      testComponentInputs.field.wrappers = ['label'];

      const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
      const elm = getFormlyFieldElement(fixture.nativeElement);

      expect(getLabelWrapper(elm).innerText).toEqual('Title');
      expect(getInputField(elm).getAttribute('placeholder')).toEqual('Title');
    });
  });

  it('should render options Types', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        formControl: new FormControl(),
        optionsTypes: ['other'],
        lifecycle: {},
        templateOptions: {
          placeholder: 'Title',
        },
      },
      form: new FormGroup({}),
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
    expect(getLabelWrapper(fixture.nativeElement)).toEqual(null);
    expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual(null);
    expect(getInputField(fixture.nativeElement).getAttribute('placeholder')).toEqual('Title');
  });
});

@Component({
  selector: 'formly-formly-field-test',
  template: '',
  entryComponents: [],
})
class TestComponent {
  field = testComponentInputs.field;
  form = testComponentInputs.form;
  model = testComponentInputs.model || {};

  changeModel(event) {}
}

@Component({
  selector: 'formly-field-text',
  template: `<input type="text" [formControl]="formControl" [formlyAttributes]="field">`,
})
export class FormlyFieldText extends FieldType {}

@Component({
  selector: 'formly-wrapper-label',
  template: `
    <label [attr.for]="id">{{ to.label }}</label>
    <ng-template #fieldComponent></ng-template>
  `,
})
export class FormlyWrapperLabel extends FieldWrapper {
}

export class Manipulator {
  run(fc) {
    fc.templateManipulators.postWrapper.push((field) => {
      if (field && field.templateOptions && field.templateOptions.postWrapper) {
        return 'label';
      }
    });

    fc.templateManipulators.preWrapper.push((field) => {
      if (field && field.templateOptions && field.templateOptions.preWrapper) {
        return 'label';
      }
    });
  }
}

@Component({
  selector: 'formly-async-wrapper',
  template: `
    <div *ngIf="to.render">
      <ng-container #fieldComponent></ng-container>
    <div>
  `,
})
export class AsyncWrapperComponent extends FieldWrapper {}