import { TestBed, ComponentFixture, TestBedStatic } from '@angular/core/testing';
import { timer } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { createGenericTestComponent } from '../test-utils';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyModule,
  FieldType,
  FieldWrapper,
  FormlyFieldConfig,
  FormlyFormBuilder,
} from '../core';
import { By } from '@angular/platform-browser';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyFieldElement(element: HTMLElement): HTMLInputElement {
  return <HTMLInputElement> element.querySelector('formly-field');
}

function getInputField(element: HTMLElement, index = 0): HTMLInputElement {
  return <HTMLInputElement> element.querySelectorAll('input')[index];
}

function getLabelWrapper(element: HTMLElement): HTMLElement {
  return <HTMLElement> element.querySelector('label');
}

let testComponentInputs;
let testingModule: TestBedStatic;

describe('FormlyField Component', () => {
  beforeEach(() => {
    testingModule = TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormlyFieldText,
        FormlyWrapperLabel,
        AsyncWrapperComponent,
        TestOnPushComponent,
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
            {
              name: 'on-push',
              component: TestOnPushComponent,
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
            options: {},
          },
        };

        const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
        const formlyField = fixture.debugElement.query(By.css('formly-field'));

        expect(formlyField.attributes.class).toEqual('foo');
        expect(formlyField.styles).toEqual({ display: 'none' });
      });

      it('should update style and class attrs on change', () => {
        testComponentInputs = {
          field: { options: {} },
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
          field: { options: {} },
        };

        const fixture = createTestComponent('<formly-field class="foo" [field]="field"></formly-field>');
        const formlyField = fixture.debugElement.query(By.css('formly-field'));

        expect(formlyField.attributes.class).toEqual('foo');
      });

  });

  it('should not throw error when field is null', () => {
    testComponentInputs = { field: null };
    const createComponent = () => {
      const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
      fixture.destroy();
    };

    expect(createComponent).not.toThrowError();
  });

  it('should call field hooks if set', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        formControl: new FormControl(),
        modelOptions: {},
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

  it('init hooks with observables', () => {
    const control = new FormControl();
    const spy = jasmine.createSpy('valueChanges spy');
    const initHookFn = (f: FormlyFieldConfig) => {
      return f.formControl.valueChanges.pipe(tap(spy));
    };

    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        formControl: control,
        modelOptions: {},
        parent: {
          formControl: new FormGroup({}),
        },
        hooks: {
          afterContentInit: initHookFn,
          afterViewInit: initHookFn,
          onInit: initHookFn,
        },
      },
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');
    expect(spy).not.toHaveBeenCalled();

    control.patchValue('test');
    expect(spy).toHaveBeenCalledTimes(3);

    spy.calls.reset();
    fixture.destroy();
    control.patchValue('test');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should support async render field type', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        wrappers: ['async_render'],
        modelOptions: {},
        hooks: {
          onInit: f => f.formControl = new FormControl(),
        },
        options: {},
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

  it('should render field type for each formly-field instance', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        formControl: new FormControl(),
        modelOptions: {},
        wrappers: [],
        duplicate: true,
        options: {},
      },
      form: new FormGroup({}),
      templateOptions: { render: true },
    };

    const fixture = createTestComponent(`
      <formly-field *ngIf="field.duplicate" [field]="field"></formly-field>
      <formly-field class="target" [field]="field"></formly-field>
    `);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('formly-field input').length).toEqual(2);
  });

  it('should render field type', () => {
    testComponentInputs = {
      field: {
        key: 'title',
        type: 'text',
        formControl: new FormControl(),
        options: {},
        modelOptions: {},
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
        options: {},
        fieldGroup: [
          {
            key: 'title1',
            type: 'text',
            formControl: new FormControl(),
            options: {},
            modelOptions: {},
            templateOptions: { placeholder: 'Title1' },
          },
          {
            key: 'title2',
            type: 'text',
            formControl: new FormControl(),
            options: {},
            modelOptions: {},
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
          options: {},
          modelOptions: {},
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
        modelOptions: {},
        optionsTypes: ['other'],
        options: {},
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

  it('should update template options of OnPush FieldType #2191', async () => {
    const options$ = timer(0).pipe(map(() => [{ value: 5, label: 'Option 5' }]), shareReplay(1));

    const field: FormlyFieldConfig = {
      key: 'push',
      type: 'on-push',
      options: {},
      formControl: new FormControl(),
      modelOptions: {},
      templateOptions: {
        options: [
          { value: 1, label: 'Option 1' },
        ],
      },
      expressionProperties: {
        'templateOptions.options': options$,
      },
    };

    const form = new FormGroup({});

    testComponentInputs = {
      field,
      form,
    };

    const fixture = createTestComponent('<formly-field [field]="field"></formly-field>');

    const formBuilder: FormlyFormBuilder = testingModule.get(FormlyFormBuilder);

    formBuilder.buildForm(form, [field], {}, {});

    const onPushInstance = fixture.nativeElement.querySelector('formly-on-push-component');

    expect(onPushInstance.textContent).toEqual(
      JSON.stringify({ options: [{ value: 1, label: 'Option 1' }] }, null, 2),
    );

    await options$.toPromise();

    fixture.detectChanges();

    expect(onPushInstance.textContent).toEqual(
      JSON.stringify({
        options: [{ value: 5, label: 'Option 5' }],
        label: '',
        placeholder: '',
        focus: false,
        disabled: false,
      }, null, 2),
    );
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

@Component({
  selector: 'formly-async-wrapper',
  template: `
    <div *ngIf="to.render">
      <ng-container #fieldComponent></ng-container>
    </div>
  `,
})
export class AsyncWrapperComponent extends FieldWrapper {}

@Component({
  selector: 'formly-on-push-component',
  template: '{{ to | json }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestOnPushComponent extends FieldType {}
