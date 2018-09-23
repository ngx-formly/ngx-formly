import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyModule,
  FieldType,
  FieldWrapper,
} from '../core';

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
      declarations: [TestComponent, FormlyFieldText, FormlyWrapperLabel],
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
          wrappers: [{
            name: 'label',
            component: FormlyWrapperLabel,
          }],
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

@Component({selector: 'formly-formly-field-test', template: '', entryComponents: []})
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
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
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
