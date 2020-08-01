import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { createGenericTestComponent, newEvent } from '../test-utils';
import { FormlyWrapperLabel, FormlyFieldText } from './formly.field.spec';

import { Component, Injectable, ViewChild, DebugElement, Optional } from '@angular/core';
import { FormlyModule, FormlyConfig } from '../core';
import { FormGroup, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FieldArrayType } from '../templates/field-array.type';
import { FormlyFormOptions } from './formly.field.config';
import { FormlyForm } from './formly.form';
import { By } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { FieldType } from '../templates/field.type';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyFieldElement(element: HTMLElement): HTMLInputElement {
  return <HTMLInputElement> element.querySelector('formly-field');
}

let app;

describe('FormlyForm Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        TestFormComponent,
        FormlyFieldText,
        FormlyWrapperLabel,
        RepeatComponent,
        ParentComponent,
        ChildComponent,
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
              name: 'repeat',
              component: RepeatComponent,
            },
            {
              name: 'parent',
              component: ParentComponent,
            },
            {
              name: 'child',
              component: ChildComponent,
            },
          ],
          wrappers: [{
            name: 'label',
            component: FormlyWrapperLabel,
          }],
        }),
      ]});
  });

  describe('immutable attr', () => {
    beforeEach(() => {
      app = {
        form: new FormGroup({}),
        options: {},
        model: {},
        fields: [{ key: 'city', type: 'text', defaultValue: 'test' }],
      };
    });

    it('should not change the component inputs', () => {
      const fixture = createTestComponent('<formly-form immutable [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      fixture.detectChanges();

      expect(app.options).toEqual({});
      expect(app.fields[0]).toEqual({ key: 'city', type: 'text', defaultValue: 'test' });
      expect(app.model).toEqual({});
    });

    it('should not change the fields when a model change', () => {
      const fixture = createTestComponent('<formly-form immutable [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      fixture.detectChanges();

      const fields = fixture.componentInstance.formlyForm.fields;
      fixture.componentInstance.model = { city: 'foo' };
      fixture.detectChanges();

      expect(fixture.componentInstance.formlyForm.fields).toBe(fields);
    });

    it('should keep in sync UI on checkExpressionChange', () => {
      app.fields = [{
        key: 'city',
        type: 'text',
        expressionProperties: {
          'templateOptions.disabled': 'model.city === "***"',
        },
      }];

      const fixture = createTestComponent('<formly-form immutable [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      fixture.detectChanges();

      const inputDe = fixture.debugElement.query(By.css('input')) as DebugElement;
      inputDe.nativeElement.value = '***';
      inputDe.nativeElement.dispatchEvent(newEvent('input', false));
      fixture.detectChanges();

      const control = app.form.get('city');
      expect(control.disabled).toEqual(true);
      expect(inputDe.attributes.disabled).toEqual('disabled');
    });

    it('should not change the input model when a new value is emitted', () => {
      const fixture = createTestComponent('<formly-form immutable [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);
      const inputDe = fixture.debugElement.query(By.css('input')) as DebugElement;

      inputDe.nativeElement.value = '***';
      inputDe.nativeElement.dispatchEvent(newEvent('input', false));

      expect(spy).toHaveBeenCalledWith({ city: '***' });
      expect(app.model).toEqual({});
      subscription.unsubscribe();
    });
  });

  it('lazy render components', () => {
    TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          extras: { lazyRender: true },
        }),
      ],
    });
    app = {
      form: new FormGroup({}),
      options: {},
      model: {},
      fields: [{
        key: 'foo',
        type: 'text',
        hide: true,
      }],
    };

    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
    expect(fixture.debugElement.query(By.css('input'))).toBeNull();

    app.fields[0].hide = false;
    expect(fixture.debugElement.query(By.css('input'))).not.toBeNull();
  });

  describe('modelChange output', () => {
    beforeEach(() => {
      app = {
        form: new FormGroup({}),
        options: {},
        model: {},
      };
    });

    it('should emit `modelChange` when model is changed', () => {
      app.fields = [{
        key: 'title',
        type: 'text',
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('title').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ title: '***' });
      subscription.unsubscribe();
    });

    it('should emit `modelChange` once when key is duplicated', () => {
      app.fields = [
        { key: 'title', type: 'text' },
        { key: 'title', type: 'text' },
      ];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('title').patchValue('***');
      app.form.get('title').patchValue('***');
      app.form.get('title').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ title: '***' });
      subscription.unsubscribe();
    });

    it('should parse model value', () => {
      app.fields = [{
        key: 'city',
        type: 'text',
        parsers: [Number],
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('city').patchValue('55');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith({ city: 55 });
      subscription.unsubscribe();
    });

    it('should ignore default debounce when using "blur" or "submit"', () => {
      app.fields = [{
        key: 'city',
        type: 'text',
        modelOptions: {
          debounce: { default: 5 },
          updateOn: 'blur',
        },
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('city').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ city: '***' });
      subscription.unsubscribe();
    });

    it('should emit `modelChange` after debounce time', fakeAsync(() => {
      app.fields = [{
        key: 'city',
        type: 'text',
        modelOptions: {
          debounce: { default: 5 },
        },
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('city').patchValue('***');
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
      tick(6);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ city: '***' });
      subscription.unsubscribe();
    }));

    it('should emit `modelChange` when nested model is changed', () => {
      app.fields = [{
        key: 'address',
        fieldGroup: [{
          fieldGroup: [{
            key: 'city',
            type: 'text',
          }],
        }],
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('address.city').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ address: { city: '***' } });
      subscription.unsubscribe();
    });

    it('should emit `modelChange` when nested model is changed through expressionProperties', () => {
      app.fields = [
        { key: 'title' },
        {
          key: 'test',
          type: 'text',
          expressionProperties: {
            'model.test': 'model.title',
          },
        },
      ];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('title').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ title: '***', test: '***' });
      subscription.unsubscribe();
    });

    it('should emit `modelChange` after `updateOn` action is triggered', () => {
      app.fields = [{
        key: 'city',
        type: 'text',
        modelOptions: {
          updateOn: 'blur',
        },
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);
      const inputDe = fixture.debugElement.query(By.css('input')) as DebugElement;

      inputDe.nativeElement.value = '***';
      inputDe.nativeElement.dispatchEvent(newEvent('input', false));

      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();

      inputDe.triggerEventHandler('blur', {});
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ city: '***' });
      subscription.unsubscribe();
    });

    // https://github.com/ngx-formly/ngx-formly/issues/1857
    it('should emit a valid model value when using square bracket notation for key', () => {
      app.fields = [
        { key: 'o[0].0.name', type: 'text' },
        { key: 'group[0]', fieldGroup: [
          { key: 'name', type: 'text' },
        ] },
      ];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      app.form.get('o.0.0.name').patchValue('***');
      // field group
      app.form.get('group.0.name').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ o: [[{ name: '***' }]], group: [{ name: '***' }] });
      subscription.unsubscribe();
    });

    it('should reset field before eval expressions', () => {
      app.fields = [
        {
          key: 'foo',
          defaultValue: 'foo',
        },
        {
          key: 'bar',
          hideExpression: '!model.foo',
          defaultValue: 'bar',
        },
      ];

      createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const config = TestBed.get(FormlyConfig);
      config.extras.checkExpressionOn = 'modelChange';

      app.form.reset();
      expect(app.model.bar).toBeNull();
      expect(app.fields[1].formControl.value).toBeNull();
    });

    it('should eval expressions before emitting `modelChange`', () => {
      app.fields = [
        { key: 'foo' },
        {
          key: 'bar',
          hideExpression: '!model.foo',
        },
      ];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const config = TestBed.get(FormlyConfig);
      config.extras.checkExpressionOn = 'modelChange';

      let barControl = null;
      const subscription = fixture.componentInstance.formlyForm.modelChange
        .subscribe(() => barControl = app.form.get('bar'));

      app.form.get('foo').patchValue('***');
      fixture.detectChanges();

      expect(barControl).not.toBeNull();
      subscription.unsubscribe();
    });

    it('should detect changes before emitting `modelChange`', () => {
      app.fields = [
        {
          key: 'foo',
          hideExpression: 'model.bar',
          hooks: {
            // Changing `field.hide` during `afterViewInit` throw the following error:
            // Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'display: '. Current value: 'display: none'.
            afterViewInit: f => f.form.get('bar').setValue('ops'),
          },
        },
        { key: 'bar' },
      ];

      const createComponent = () => createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      expect(createComponent).not.toThrowError(/ExpressionChangedAfterItHasBeenCheckedError/i);
      expect(app.fields[0].hide).toEqual(true);
    });
  });

  it('should fallback null fields to empty array', () => {
    app = { fields: null };
    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

    expect(fixture.componentInstance.formlyForm.fields).toEqual([]);
  });

  it('should reset model', () => {
    app = {
      fields: [{
        fieldGroup: [{
          key: 'name',
          type: 'text',
        }],
      }, {
        key: 'investments',
        type: 'repeat',
        fieldArray: {
          fieldGroup: [{
            key: 'investmentName',
            type: 'text',
          }],
        },
      }],
      form: new FormGroup({}),
      options: {},
      model: {
        investments: [{investmentName: 'FA'}, {}],
      },
    };
    createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

    expect(app.form.controls.investments.length).toEqual(2);
    expect(app.model.investments.length).toEqual(2);

    app.options.resetModel({ investments: [{ investmentName: 'FA' }, {}, {}] });
    expect(app.form.controls.investments.length).toEqual(3);
    expect(app.model.investments.length).toEqual(3);

    // ensure tracking model change is still working
    app.form.get('investments.0.investmentName').patchValue('TEST');
    expect(app.model.investments[0]).toEqual({ investmentName: 'TEST' });

    app.options.resetModel({});
    expect(app.form.controls.investments.length).toEqual(0);
    expect(app.model.investments.length).toEqual(0);
  });

  // https://github.com/ngx-formly/ngx-formly/issues/1872
  it('should clone initialModel during reset model', () => {
    app = {
      fields: [{
        key: 'array',
        type: 'repeat',
        fieldArray: { type: 'text' },
      }],
      form: new FormGroup({}),
      options: {},
      model: { array: ['FA'] },
    };
    createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

    app.form.get('array.0').patchValue('TEST');
    app.options.resetModel();
    app.form.get('array.0').patchValue('TEST');
    app.options.resetModel();
    expect(app.model.array[0]).toEqual('FA');
  });

  it('should emit `modelChange` when custom FormGroup change', () => {
    app = {
      fields: [{
        key: 'address',
        formControl: new FormGroup({
          city: new FormControl(),
        }),
      }],
      form: new FormGroup({}),
      options: {},
      model: {},
    };

    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
    const spy = jasmine.createSpy('model change spy');
    const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

    app.form.get('address.city').setValue('foo');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ address: { city: 'foo' } });
    subscription.unsubscribe();
  });

  it('should keep the value in sync when using multiple fields with same key', () => {
    app = {
      fields: [
        { key: 'name', type: 'text' },
        { key: 'name', type: 'text' },
      ],
      form: new FormGroup({}),
      options: {},
      model: {},
    };

    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

    const inputs = fixture.debugElement.queryAll(By.css('input')) as DebugElement[];
    inputs[0].nativeElement.value = 'First';
    inputs[0].nativeElement.dispatchEvent(newEvent('input', false));

    fixture.detectChanges();
    expect(app.form.get('name').value).toEqual('First');
    expect(inputs[1].nativeElement.value).toEqual('First');
  });

  it('should ignore validation of hidden fields (same key)', () => {
    app = {
      fields: [
        { key: 'name', hide: true, templateOptions: { required: true } },
        { key: 'name' },
      ],
      form: new FormGroup({}),
      options: {},
      model: {},
    };

    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

    expect(app.form.valid).toEqual(true);

    app.fields[0].hide = false;
    fixture.detectChanges();
    expect(app.form.valid).toEqual(false);
  });


  it('should update the form controls when changing the model', () => {
    app = {
      fields: [{
        fieldGroup: [{
          key: 'name',
          type: 'text',
        }],
      }, {
        key: 'investments',
        type: 'repeat',
        fieldArray: {
          fieldGroup: [{
            key: 'investmentName',
            type: 'text',
          }],
        },
      }],
      form: new FormGroup({}),
      options: {},
      model: {
        investments: [],
      },
    };
    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
    expect(app.form.controls.investments.length).toEqual(0);
    expect(app.model.investments.length).toEqual(0);

    const newModel = {
      ...app.model,
      investments: [
        {
          investmentName: 'bitcoin',
        },
        {
          investmentName: 'facilities',
        },
      ],
    };
    fixture.componentInstance.model = newModel;

    fixture.detectChanges();
    expect(app.form.controls.investments.length).toEqual(2);
    expect(app.fields[0].model).toBe(newModel);

    fixture.componentInstance.model = {
      ...app.model,
      investments: null,
    };
  });

  describe('hideExpression', () => {
    let field;

    beforeEach(() => {
      field = {
        key: 'title',
        type: 'text',
        templateOptions: {
          label: 'Title',
          placeholder: 'Title',
        },
      };
      app = { fields: [field], options: { formState: { blah: 1 } }, model: { address: { city: '' } } };
    });

    it('should hide field using a boolean value', () => {
      field.hideExpression = true;

      const fixture = createTestComponent('<formly-form [fields]="fields"></formly-form>');
      expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('display: none;');

      field.hideExpression = false;
      fixture.detectChanges();
      expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('');
    });

    it('should hide field using a string expression', () => {
      field.hideExpression = 'true';

      const fixture = createTestComponent('<formly-form [fields]="fields"></formly-form>');
      expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('display: none;');
    });

    it('should hide field using a function', () => {
      field.hideExpression = () => true;

      const fixture = createTestComponent('<formly-form [fields]="fields"></formly-form>');
      expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('display: none;');

      field.hideExpression = () => false;
      fixture.detectChanges();
      expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('');
    });

    it('should provide model, formState and field', () => {
      const spy = jasmine.createSpy('hideExpression spy');
      field.hideExpression = spy;

      const fixture = createTestComponent('<formly-form [fields]="fields" [options]="options" [model]="model"></formly-form>');
      fixture.detectChanges();
      const args = spy.calls.mostRecent().args;
      expect(args[0]).toEqual(app.model);
      expect(args[1]).toEqual(app.options.formState);
      expect(args[2]).toEqual(field);
    });

    it('should apply model changes when form is enabled', () => {
      const form = new FormGroup({});
      app.form = form;
      app.model = {};
      app.fields = [{
        key: 'address',
        hideExpression: () => true,
        fieldGroup: [{
          key: 'city',
          type: 'text',
        }],
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(form.get('address')).toBeNull();

      app.fields[0].hideExpression = () => false;
      app.model.address.city = 'test';
      fixture.detectChanges();
      expect(form.get('address.city').value).toEqual('test');
    });

    it('should support passing number or array path to field key', () => {
      const form = new FormGroup({});
      app.form = form;
      app.model = {};
      app.fields = [
        { key: 1, defaultValue: 'number' },
        { key: ['this:is:a:valid:property:for:a:json:object:1.0'], defaultValue: 'array' },
      ];

      createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(app.model).toEqual({
        1: 'number',
        'this:is:a:valid:property:for:a:json:object:1.0': 'array',
      });
    });

    it('should hide/display field using a function with nested field key', fakeAsync(() => {
      const form = new FormGroup({});
      app.form = form;
      app.model = { address: [{ city: '' }] };
      field.key = 'address[0].city';
      field.hideExpression = '!(model.address && model.address[0] && model.address[0].city === "agadir")';

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      tick(1);
      expect(form.get('address.0.city')).toBeNull();

      app.model.address[0].city = 'agadir';
      fixture.detectChanges();
      tick(1);
      expect(form.get('address.0.city')).not.toBeNull();
      expect(form.get('address.0.city').value).toEqual('agadir');
    }));

    it('should hide/display child fields when field has empty key', fakeAsync(() => {
      const form = new FormGroup({});
      app.form = form;
      app.model = {};
      app.fields = [{
        hideExpression: () => true,
        fieldGroup: [{
          fieldGroup: [
            {
              key: 'city',
              type: 'text',
            },
            {
              key: 'zipCode',
              type: 'text',
              hideExpression: () => false,
            },
          ],
        }],
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      tick(1);
      expect(form.get('city')).toBeNull();
      expect(form.get('zipCode')).toBeNull();

      app.fields[0].hideExpression = () => false;
      fixture.detectChanges();
      expect(form.get('city')).not.toBeNull();
      expect(form.get('zipCode')).not.toBeNull();
    }));
  });

  describe('expressionProperties', () => {
    let field, model, form: FormGroup;

    beforeEach(() => {
      form = new FormGroup({});
      model = {};
      field = {
        key: 'title',
        type: 'text',
        templateOptions: {
          placeholder: 'Title',
        },
      };
      app = { fields: [field], model, form };
    });

    it('should update className', () => {
      field.expressionProperties = {
        'className': 'model.title',
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(field.className).toEqual(undefined);

      model.title = 'test';
      fixture.detectChanges();

      expect(field.className).toEqual('test');
    });

    describe('model', () => {
      it('should update model and assign it into formControl', () => {
        model.title = 'test';
        field.expressionProperties = {
          'model.title': `field.templateOptions.disabled ? '':model.title`,
        };

        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
        expect(model.title).toEqual('test');
        expect(field.formControl.value).toEqual('test');

        field.templateOptions.disabled = true;
        fixture.detectChanges();

        expect(model.title).toEqual('');
        expect(field.formControl.value).toEqual('');
      });

      it('should update model and assign it into formControl within nested form', () => {
        model.title = 'test';
        field.expressionProperties = {
          'model.title': `field.templateOptions.disabled ? '':model.title`,
        };

        delete field.key;
        delete field.type;
        field.fieldGroup = [
          {
            key: 'title',
            type: 'text',
            templateOptions: {
              placeholder: 'Title',
            },
          },
        ];

        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
        expect(model.title).toEqual('test');
        expect(field.fieldGroup[0].formControl.value).toEqual('test');

        field.templateOptions.disabled = true;
        fixture.detectChanges();

        expect(model.title).toEqual('');
        expect(field.fieldGroup[0].formControl.value).toEqual('');
      });
    });

    it('should enable/disable formControl when templateOptions.disabled is set', () => {
      field.expressionProperties = {
        'templateOptions.disabled': 'model.title !== undefined',
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(field.templateOptions.disabled).toEqual(false);
      expect(form.get('title').enabled).toEqual(true);

      model.title = 'test';
      fixture.detectChanges();

      expect(field.templateOptions.disabled).toEqual(true);
      expect(form.get('title').enabled).toEqual(false);
    });

    const options = [
      { name: 'required', value: true, invalid: null },
      { name: 'pattern', value: '[0-9]{5}', invalid: 'ddd' },
      { name: 'minLength', value: 5, invalid: '123' },
      { name: 'maxLength', value: 10, invalid: '12345678910' },
      { name: 'min', value: 5, invalid: 3 },
      { name: 'max', value: 10, invalid: 11 },
    ];

    options.forEach(option => {
      it(`templateOptions.${option.name}`, () => {
        let enableExpression = true;
        field.expressionProperties = {
          [`templateOptions.${option.name}`]: () => {
            return enableExpression ? option.value : false;
          },
        };
        model.title = option.invalid;
        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');

        expect(field.templateOptions[option.name]).toEqual(option.value);
        expect(form.valid).toEqual(false);

        enableExpression = false;
        fixture.detectChanges();

        expect(field.templateOptions[option.name]).toEqual(false);
        expect(form.valid).toEqual(true);
      });
    });
  });

  it('should check expression on modelChange only', () => {
    app = {
      fields: [{
        key: 'name',
        type: 'text',
        hideExpression: 'model.name',
      }],
      form: new FormGroup({}),
      options: {},
      model: {},
    };
    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
    const config = TestBed.get(FormlyConfig);
    config.extras.checkExpressionOn = 'modelChange';

    app.model.name = 'test';
    fixture.detectChanges();
    expect(app.fields[0].hide).toBeFalsy();

    app.fields[0].formControl.setValue('test');
    fixture.detectChanges();
    expect(app.fields[0].hide).toBeTruthy();

    const formlyField = fixture.debugElement.query(By.css('formly-field'));
    expect(formlyField.styles).toEqual({ display: 'none' });
  });

  it('should check expression on submit', () => {
    app = {
      fields: [{
        key: 'name',
        type: 'text',
        hideExpression: 'field.options.parentForm.submitted',
      }],
      form: new FormGroup({}),
      options: {},
      model: {},
    };
    createTestComponent(`
      <form [formGroup]="form">
        <formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>
      </form>
    `);
    const config = TestBed.get(FormlyConfig);
    config.extras.checkExpressionOn = 'modelChange';

    expect(app.fields[0].hide).toEqual(false);

    app.options.parentForm.submitted = true;
    expect(app.fields[0].hide).toEqual(true);
  });

  describe('options', () => {
    let field, model, form: FormGroup, options: FormlyFormOptions;
    beforeEach(() => {
      form = new FormGroup({});
      model = {};
      options = {};
      field = {
        key: 'title',
        type: 'text',
        templateOptions: {
          placeholder: 'Title',
        },
      };
      app = { fields: [field], model, form, options };
    });

    it('resetForm', () => {
      // initial value
      model.title = 'test';
      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      form.get('title').setValue('edit title');
      fixture.detectChanges();

      expect(model.title).toEqual('edit title');

      options.resetModel();
      expect(model.title).toEqual('test');
    });

    it('should reset hidden fields', () => {
      app.fields[0].hideExpression = true;
      // initial value
      createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      options.resetModel({ title: 'test' });
      expect(model.title).toEqual('test');
    });

    it('updateInitialValue', () => {
      // initial value
      model.title = 'test';
      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      form.get('title').setValue('edit title');
      fixture.detectChanges();

      expect(model.title).toEqual('edit title');
      options.updateInitialValue();

      options.resetModel();
      expect(model.title).toEqual('edit title');
    });
  });

  describe('model input change', () => {
    it('should update the form value', () => {
      app = {
        model: {},
        form: new FormGroup({}),
        fields: [{ key: 'test', type: 'text' }],
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(app.form.value).toEqual({ test: null });

      fixture.componentInstance.model = { test: '***' };
      fixture.detectChanges();
      expect(app.form.value).toEqual({ test: '***' });
    });

    it('fallback to undefined for an non-existing member', () => {
      app = {
        model: { aa: { test: 'aaa' } },
        form: new FormGroup({}),
        fields: [{
          key: 'aa',
          fieldGroup: [{ key: 'test', type: 'text' }],
        }],
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(app.form.value).toEqual({ aa: { test: 'aaa' } });

      fixture.componentInstance.model = {};
      fixture.detectChanges();
      expect(app.form.value).toEqual({ aa: { test: undefined } });
    });

    it('should not emit `modelChange`', () => {
      app = {
        model: {},
        form: new FormGroup({}),
        fields: [{ key: 'test', type: 'text' }],
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(app.form.value).toEqual({ test: null });

      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      fixture.componentInstance.model = { test: '***' };
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should take account of using the emitted modelChange value as model input', () => {
      app = {
        model: {},
        form: new FormGroup({}),
        fields: [{ key: 'test', type: 'text' }],
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" (modelChange)="model = $event"></formly-form>');
      app.form.get('test').setValue('1');
      fixture.detectChanges();

      app.form.get('test').setValue('12');
      fixture.detectChanges();

      expect(app.model.test).toEqual('12');
      expect(app.form.get('test').value).toEqual('12');
    });
  });

  describe('form input', () => {
    it('should not rebuild field when form is not root', () => {
      app = {
        model: { test: 'test' },
        form: new FormGroup({}),
        fields: [
          {
            fieldGroup: [
              { key: 'test', type: 'text' },
            ],
          },
          {
            fieldGroup: [
              { key: 'test2', type: 'text' },
            ],
          },
        ],
      };

      const spy = jasmine.createSpy('model change spy');
      const subscription = (<FormGroup> app.form).valueChanges.subscribe(spy);

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ test: 'test', test2: null });
      subscription.unsubscribe();
    });

    it('should rebuild field when form is changed', () => {
      app = {
        model: { test: 'test' },
        form: new FormGroup({}),
        fields: [{
          key: 'test',
          type: 'text',
          templateOptions: {
            placeholder: 'Title',
          },
        }],
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      expect(app.form.get('test').value).toEqual('test');

      fixture.componentInstance.form = new FormGroup({});
      fixture.componentInstance.model = { test: 'aaa' };
      fixture.detectChanges();
      expect(app.form.get('test').value).toEqual('aaa');
    });

    it('should allow passing FormArray', () => {
      app = {
        model: ['test'],
        form: new FormArray([]),
        options: {},
        fields: [{
          key: '0',
          type: 'text',
          templateOptions: {
            placeholder: 'Title',
          },
        }],
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      fixture.detectChanges();

      expect(app.form.at(0).value).toEqual('test');
    });
  });

  describe('`updateOn` support', () => {
    describe('on blur', () => {
      it('should work on all form controls in a form group', () => {
        app = {
          model: {},
          form: new FormGroup({}, { updateOn: 'blur' }),
          fields: [
            {
              key: 'firstName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
            {
              key: 'lastName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
          ],
        };

        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
        const inputDeEls = fixture.debugElement.queryAll(By.css('input')) as DebugElement[];

        expect(app.form.get('firstName').value).toBeNull();
        expect(app.form.get('lastName').value).toBeNull();

        inputDeEls[0].nativeElement.value = 'First';
        inputDeEls[0].nativeElement.dispatchEvent(newEvent('input', false));

        inputDeEls[1].nativeElement.value = 'Last';
        inputDeEls[1].nativeElement.dispatchEvent(newEvent('input', false));

        fixture.detectChanges();

        expect(app.form.get('firstName').value).toBeNull();
        expect(app.form.get('lastName').value).toBeNull();
        expect(app.model.firstName).toBeUndefined();
        expect(app.model.lastName).toBeUndefined();
        expect(app.form.valid).toBe(false);

        inputDeEls[0].triggerEventHandler('blur', {});
        fixture.detectChanges();

        expect(app.form.get('firstName').value).toEqual('First');
        expect(app.form.get('lastName').value).toBeNull();
        expect(app.model.firstName).toEqual('First');
        expect(app.model.lastName).toBeUndefined();
        expect(app.form.valid).toBe(false);

        inputDeEls[1].triggerEventHandler('blur', {});
        fixture.detectChanges();

        expect(app.form.get('firstName').value).toEqual('First');
        expect(app.form.get('lastName').value).toEqual('Last');
        expect(app.model.firstName).toEqual('First');
        expect(app.model.lastName).toEqual('Last');
        expect(app.form.valid).toBe(true);
      });

      it('should not wait for submit to set value programmatically', () => {
        app = {
          model: {},
          form: new FormGroup({}, { updateOn: 'blur' }),
          fields: [
            {
              key: 'firstName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
            {
              key: 'lastName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
          ],
        };

        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
        const inputDeEls = fixture.debugElement.queryAll(By.css('input')) as DebugElement[];

        expect(app.form.get('firstName').value).toBeNull();
        expect(app.form.get('lastName').value).toBeNull();

        app.form.patchValue({
          firstName: 'First',
          lastName: 'Last',
        });
        fixture.detectChanges();

        expect(inputDeEls[0].nativeElement.value).toEqual('First');
        expect(inputDeEls[1].nativeElement.value).toEqual('Last');
        expect(app.form.get('firstName').value).toEqual('First');
        expect(app.form.get('lastName').value).toEqual('Last');
        expect(app.form.valid).toBe(true);
      });
    });

    describe('on submit', () => {
      it('should work on all form controls in a form group', () => {
        app = {
          model: {},
          form: new FormGroup({}, { updateOn: 'submit' }),
          fields: [
            {
              key: 'firstName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
            {
              key: 'lastName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
          ],
        };

        const fixture = TestBed.createComponent(TestFormComponent);
        // Allow <formly-form> to initialize
        fixture.detectChanges();

        const formDe = fixture.debugElement.query(By.css('form')) as DebugElement;
        const inputDeEls = formDe.queryAll(By.css('input')) as DebugElement[];

        expect(app.form.get('firstName').value).toBeNull();
        expect(app.form.get('lastName').value).toBeNull();

        inputDeEls[0].nativeElement.value = 'First';
        inputDeEls[0].nativeElement.dispatchEvent(newEvent('input', false));

        inputDeEls[1].nativeElement.value = 'Last';
        inputDeEls[1].nativeElement.dispatchEvent(newEvent('input', false));

        fixture.detectChanges();

        expect(app.form.get('firstName').value).toBeNull();
        expect(app.form.get('lastName').value).toBeNull();
        expect(app.form.valid).toBe(false);

        inputDeEls[0].triggerEventHandler('blur', {});
        inputDeEls[1].triggerEventHandler('blur', {});
        fixture.detectChanges();

        expect(app.form.get('firstName').value).toBeNull();
        expect(app.form.get('lastName').value).toBeNull();
        expect(app.form.valid).toBe(false);

        formDe.triggerEventHandler('submit', {});
        fixture.detectChanges();

        expect(app.form.get('firstName').value).toEqual('First');
        expect(app.form.get('lastName').value).toEqual('Last');
        expect(app.form.valid).toBe(true);
      });

      it('should not wait for submit to set value programmatically', () => {
        app = {
          model: {},
          form: new FormGroup({}, { updateOn: 'submit' }),
          fields: [
            {
              key: 'firstName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
            {
              key: 'lastName',
              type: 'text',
              templateOptions: {
                required: true,
              },
            },
          ],
        };

        const fixture = TestBed.createComponent(TestFormComponent);
        // Allow <formly-form> to initialize
        fixture.detectChanges();

        const formDe = fixture.debugElement.query(By.css('form')) as DebugElement;
        const inputDeEls = formDe.queryAll(By.css('input')) as DebugElement[];

        expect(app.form.get('firstName').value).toBeNull();
        expect(app.form.get('lastName').value).toBeNull();

        app.form.patchValue({
          firstName: 'First',
          lastName: 'Last',
        });
        fixture.detectChanges();

        expect(inputDeEls[0].nativeElement.value).toEqual('First');
        expect(inputDeEls[1].nativeElement.value).toEqual('Last');
        expect(app.form.get('firstName').value).toEqual('First');
        expect(app.form.get('lastName').value).toEqual('Last');
        expect(app.form.valid).toBe(true);
      });
    });
  });

  describe('component-level injectors', () => {
    it('should inject parent service to child type', () => {
      app = {
        form: new FormGroup({}),
        options: {},
        model: {},
        fields: [{
          type: 'parent',
          fieldGroup: [{
            type: 'child',
            fieldGroup: [{ key: 'email', type: 'text' }],
          }],
        }],
      };

      // should inject `ParentService` in `ChildComponent` without raising an error
      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const childInstance: ChildComponent = fixture.debugElement
        .query(By.css('formly-child'))
        .componentInstance;

      expect(childInstance.parent).not.toBeNull();
      expect(childInstance.wrapper).toBeNull();
    });

    it('should inject parent wrapper to child type', () => {
      app = {
        form: new FormGroup({}),
        options: {},
        model: {},
        fields: [{
          wrappers: ['label'],
          fieldGroup: [{
            type: 'child',
            fieldGroup: [{ key: 'email', type: 'text' }],
          }],
        }],
      };

      // should inject `FormlyWrapperLabel` in `ChildComponent` without raising an error
      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const childInstance: ChildComponent = fixture.debugElement
        .query(By.css('formly-child'))
        .componentInstance;

      expect(childInstance.wrapper).not.toBeNull();
      expect(childInstance.parent).toBeNull();
    });
  });

  it('should call the validation only once during build', () => {
    const fooValidator = { expression: () => false };
    const spy = spyOn(fooValidator, 'expression');

    app = {
      form: new FormGroup({}),
      fields: [
        { key: 'f1', validators: { fooValidator } },
        { key: 'f2' },
        { key: 'f3', fieldGroup: [{ key: 'f4' }] },
      ],
    };

    const fixture = createTestComponent(`
      <form [formGroup]="form">
        <formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>
      </form>
    `);

    fixture.detectChanges();
    expect(fooValidator.expression).toHaveBeenCalledTimes(1);

    // re-build model change
    spy.calls.reset();
    fixture.componentInstance.model = { f1: 'foo' };
    fixture.detectChanges();
    expect(fooValidator.expression).toHaveBeenCalledTimes(1);

    // re-build option change
    spy.calls.reset();
    fixture.componentInstance.options = {};
    fixture.detectChanges();
    expect(fooValidator.expression).not.toHaveBeenCalled();
  });

  it('should keep formly valueChanges calls consisting on rebuild', () => {
    app = {
      form: new FormGroup({}),
      fields: [{ key: 'foo' }],
    };

    const fixture = createTestComponent(`<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>`);

    const spy = jasmine.createSpy('model change spy');
    const control = app.form.get('foo');
    const subscription = control.valueChanges
      .pipe(map(() => fixture.componentInstance.model.foo))
      .subscribe(spy);

    // re-build model change
    fixture.componentInstance.model = {};
    fixture.detectChanges();

    control.setValue('foo');
    expect(control.valueChanges['observers'].length).toEqual(2);
    expect(spy).toHaveBeenCalledWith('foo');

    fixture.destroy();
    subscription.unsubscribe();

    expect(control.valueChanges['observers'].length).toEqual(0);
  });
});

@Component({
  selector: 'formly-form-comp',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <formly-form #ff [model]="model" [fields]="fields" [options]="options" [form]="form">
        <button type="submit">Submit</button>
      </formly-form>
    </form>`,
})
class TestFormComponent {
  @ViewChild(FormlyForm) ff: FormlyForm;

  fields = app.fields;
  form = app.form;
  model = app.model || {};
  options = app.options;

  submit(): void {}
}

@Component({
  selector: 'formly-form-test',
  template: '',
  entryComponents: [],
})
class TestComponent {
  @ViewChild(FormlyForm) formlyForm: FormlyForm;

  fields = app.fields;
  form = app.form;
  model = app.model || {};
  options = app.options;
}

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index;">
      <formly-group [field]="field"></formly-group>
      <button [id]="'remove-' + i" type="button" (click)="remove(i)">Remove</button>
    </div>
    <button id="add" type="button" (click)="add()">Add</button>
  `,
})
class RepeatComponent extends FieldArrayType {}

@Injectable()
export class ParentService {}


@Component({
  selector: 'formly-parent',
  template: `<formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>`,
  providers: [ParentService],
})
export class ParentComponent extends FieldType {
  constructor(public parent: ParentService) {
    super();
  }
}

@Component({
  selector: 'formly-child',
  template: `<ng-content></ng-content>`,
})
export class ChildComponent {
  constructor(
    @Optional() public parent: ParentService,
    @Optional() public wrapper: FormlyWrapperLabel,
  ) {}
}
