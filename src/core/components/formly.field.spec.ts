import { fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  FormlyModule,
  FieldType,
  FieldWrapper,
} from '../core';
import { FormlyValueChangeEvent } from '../services/formly.event.emitter';

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

  it('should render template option', () => {
    testComponentInputs = {
      field: { template: '<div>Nested property keys</div>'},
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');

    expect(fixture.nativeElement.innerText).toEqual('Nested property keys');
  });

  it('should render field type', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        templateOptions: {
          placeholder: 'Title',
        },
      },
      form: new FormGroup({title: new FormControl()}),
    };

    const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');

    expect(getLabelWrapper(fixture.nativeElement)).toEqual(null);
    expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual(null);
    expect(getInputField(fixture.nativeElement).getAttribute('placeholder')).toEqual('Title');
  });

  it('should render fieldGroup', () => {
    testComponentInputs = {
      field: {
        fieldGroup: [
          {
            key: 'title1',
            type: 'text',
            templateOptions: { placeholder: 'Title1' },
          },
          {
            key: 'title2',
            type: 'text',
            templateOptions: { placeholder: 'Title2' },
          },
        ],
      },
      form: new FormGroup({ title1: new FormControl(), title2: new FormControl() }),
    };

    const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');

    expect(getInputField(fixture.nativeElement, 0).getAttribute('placeholder')).toEqual('Title1');
    expect(getInputField(fixture.nativeElement, 1).getAttribute('placeholder')).toEqual('Title2');
  });

  it('should hide field', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        hideExpression: true,
        templateOptions: {
          label: 'Title',
          placeholder: 'Title',
        },
      },
      form: new FormGroup({title: new FormControl()}),
    };

    const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');

    expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('display: none;');
  });

  describe('model changes', () => {
    beforeEach(() => {
      testComponentInputs = {
        field: {
          key: 'title',
          type: 'text',
          templateOptions: {
            label: 'Title',
            placeholder: 'Title',
          },
        },
        form: new FormGroup({ title: new FormControl() }),
      };
    });

    it('should change model value', () => {
      const fixture = createTestComponent('<formly-field [form]="form" [field]="field" [model]="model" (modelChange)="changeModel($event)"></formly-field>');
      spyOn(fixture.componentInstance, 'changeModel');
      fixture.componentInstance.form.get('title').setValue('address');

      expect(fixture.componentInstance.changeModel).toHaveBeenCalledWith(new FormlyValueChangeEvent('title', 'address'));
    });

    it('should change model value after debounce time', fakeAsync(() => {
      testComponentInputs.field.modelOptions = {
        debounce: { default: 5 },
      };

      const fixture = createTestComponent('<formly-field [form]="form" [field]="field" [model]="model" (modelChange)="changeModel($event)"></formly-field>');
      spyOn(fixture.componentInstance, 'changeModel');
      fixture.componentInstance.form.get('title').setValue('address');

      expect(fixture.componentInstance.changeModel).not.toHaveBeenCalled();
      tick(6);
      expect(fixture.componentInstance.changeModel).toHaveBeenCalledWith(new FormlyValueChangeEvent('title', 'address'));
    }));
  });

  describe('wrapper', () => {
    beforeEach(() => {
      testComponentInputs = {
        field: {
          key: 'title',
          type: 'text',
          templateOptions: {
            label: 'Title',
            placeholder: 'Title',
          },
        },
        form: new FormGroup({ title: new FormControl() }),
      };
    });

    it('should render field without wrapper or key', () => {
      delete testComponentInputs.field.key;

      const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');
      const elm = getFormlyFieldElement(fixture.nativeElement);
      expect(getInputField(elm)).toBeDefined();
    });

    it('should render field wrapper', () => {
      testComponentInputs.field.wrappers = ['label'];

      const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');
      const elm = getFormlyFieldElement(fixture.nativeElement);

      expect(getLabelWrapper(elm).innerText).toEqual('Title');
      expect(getInputField(elm).getAttribute('placeholder')).toEqual('Title');
    });

    it('should render pre-wrapper', () => {
      testComponentInputs.field.templateOptions.preWrapper = true;

      const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');
      const elm = getFormlyFieldElement(fixture.nativeElement);

      expect(getLabelWrapper(elm).innerText).toEqual('Title');
    });

    it('should render post-wrapper', () => {
      testComponentInputs.field.templateOptions.postWrapper = true;

      const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');
      const elm = getFormlyFieldElement(fixture.nativeElement);

      expect(getLabelWrapper(elm).innerText).toEqual('Title');
    });

    it('should render pre/post-wrapper using templateManipulators option', () => {
      testComponentInputs.field.templateOptions.templateManipulators = { preWrapper: () => 'label' };

      const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');
      const elm = getFormlyFieldElement(fixture.nativeElement);

      expect(getLabelWrapper(elm).innerText).toEqual('Title');
    });
  });

  it('should render options Types', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        optionsTypes: ['other'],
        templateOptions: {
          placeholder: 'Title',
        },
      },
      form: new FormGroup({title: new FormControl()}),
    };

    const fixture = createTestComponent('<formly-field [form]="form" [field]="field"></formly-field>');
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
class FormlyFieldText extends FieldType {}

@Component({
  selector: 'formly-wrapper-label',
  template: `
    <label [attr.for]="id">{{templateOptions.label}}</label>
    <template #fieldComponent></template>
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
