import { fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { FormlyInputModule, createComponent, newEvent } from '@ngx-formly/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Injectable, DebugElement } from '@angular/core';
import { FormlyModule, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';

type IFormlyFormInputs = Partial<{
  form: FormGroup | FormArray;
  fields: FormlyFieldConfig[];
  options: FormlyFormOptions;
  model: any;
  modelChange: (m: any) => void;
}>;

const renderComponent = (inputs: IFormlyFormInputs, config: any = {}) => {
  inputs = {
    form: new FormGroup({}),
    model: {},
    options: {},
    fields: [],
    modelChange: model => {},
    ...inputs,
  };

  return createComponent<IFormlyFormInputs>({
    template: `
      <form [formGroup]="form">
        <formly-form
          [model]="model"
          [fields]="fields"
          [options]="options"
          [form]="form"
          (modelChange)="modelChange($event)">
        </formly-form>
      </form>
    `,
    inputs,
    config,
    declarations: [ParentComponent, ChildComponent],
    imports: [
      FormlyInputModule,
      FormlyModule.forChild({
        types: [
          {
            name: 'parent',
            component: ParentComponent,
          },
          {
            name: 'child',
            component: ChildComponent,
          },
        ],
      }),
    ],
    ...config,
  });
};

function getFormlyFormElement(fixture: ComponentFixture<any>): HTMLElement {
  return <HTMLInputElement>fixture.nativeElement.querySelector('formly-form');
}

function getFormlyFormFields(fixture: ComponentFixture<any>): HTMLInputElement[] {
  return fixture.nativeElement.querySelectorAll('formly-form > formly-field');
}

describe('FormlyForm Component', () => {
  describe('fields input', () => {
    it('should render fields', () => {
      const fixture = renderComponent({
        fields: [{ key: 'foo' }, { key: 'bar' }],
      });

      expect(getFormlyFormElement(fixture)).toBeDefined();
      expect(getFormlyFormFields(fixture).length).toEqual(2);
    });

    it('should not throw an error when fields is null', () => {
      const fixture = renderComponent({ fields: null });

      expect(getFormlyFormElement(fixture)).toBeDefined();
      expect(getFormlyFormFields(fixture).length).toEqual(0);
    });
  });

  it('should emit `modelChange` on valueChanges', () => {
    const fixture = renderComponent({
      fields: [{ key: 'title', type: 'input' }],
    });

    const app = fixture.componentInstance;
    spyOn(app, 'modelChange');

    app.form.get('title').patchValue('***');
    fixture.detectChanges();

    expect(app.modelChange).toHaveBeenCalledTimes(1);
    expect(app.modelChange).toHaveBeenCalledWith({ title: '***' });
  });

  it('should check expression on valueChanges', fakeAsync(() => {
    const fixture = renderComponent({
      fields: [
        {
          key: 'title',
          type: 'input',
          expressionProperties: {
            className: 'model.title',
          },
        },
      ],
    });

    const app = fixture.componentInstance;
    app.form.get('title').patchValue('***');
    tick();
    expect(app.fields[0].className).toEqual('***');
  }));

  it('should check expression on valueChanges only', () => {
    const fixture = renderComponent(
      {
        fields: [
          {
            key: 'title',
            type: 'input',
            expressionProperties: {
              className: 'model.title',
            },
          },
        ],
      },
      {
        extras: { checkExpressionOn: 'modelChange' },
      },
    );

    const app = fixture.componentInstance;
    app.model.title = '***';
    fixture.detectChanges();
    expect(app.fields[0].className).toBeUndefined();
  });

  describe('immutable option', () => {
    it('should render', () => {
      const fixture = renderComponent(
        {
          fields: [{ key: 'foo', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      expect(getFormlyFormElement(fixture)).toBeDefined();
      expect(getFormlyFormFields(fixture).length).toEqual(1);
    });

    it('should not change inputs', () => {
      const fixture = renderComponent(
        {
          fields: [{ key: 'city', defaultValue: 'test' }],
        },
        { extras: { immutable: true } },
      );
      const app = fixture.componentInstance;

      expect(app.options).toEqual({});
      expect(app.fields[0]).toEqual({ key: 'city', defaultValue: 'test' });
      expect(app.model).toEqual({});
    });

    it('should emit `modelChange`', () => {
      const fixture = renderComponent(
        {
          fields: [{ key: 'title', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      const app = fixture.componentInstance;
      spyOn(app, 'modelChange');

      app.form.get('title').patchValue('***');
      fixture.detectChanges();

      expect(app.modelChange).toHaveBeenCalledTimes(1);
      expect(app.modelChange).toHaveBeenCalledWith({ title: '***' });
      expect(app.model).toEqual({});
    });

    it('should take account of inputs changes`', () => {
      const fixture = renderComponent(
        {
          fields: [{ key: 'title', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      const app = fixture.componentInstance;
      let titleField;
      app.model = { title: 'foo' };
      app.fields = [{ key: 'title', hooks: { onInit: f => (titleField = f) } }];
      fixture.detectChanges();

      expect(app.model).not.toBe(titleField.model);
      expect(app.fields[0]).not.toBe(titleField);
      expect(titleField.model).toEqual({ title: 'foo' });
      expect(app.form.value).toEqual({ title: 'foo' });
    });
  });

  describe('model input', () => {
    it('should update the form value on model change', () => {
      const fixture = renderComponent({
        fields: [
          {
            key: 'title',
            type: 'input',
            expressionProperties: {
              className: 'model.title',
            },
          },
        ],
      });
      const app = fixture.componentInstance;
      expect(app.form.value).toEqual({ title: null });

      app.model = { title: '***' };
      fixture.detectChanges();
      expect(app.form.value).toEqual({ title: '***' });
    });

    it('fallback to undefined for an non-existing member', () => {
      const fixture = renderComponent({
        model: { aa: { test: 'aaa' } },
        fields: [
          {
            key: 'aa',
            fieldGroup: [{ key: 'test', type: 'input' }],
          },
        ],
      });
      const app = fixture.componentInstance;
      expect(app.form.value).toEqual({ aa: { test: 'aaa' } });

      app.model = {};
      fixture.detectChanges();
      expect(app.form.value).toEqual({ aa: { test: undefined } });
    });

    it('should emit `modelChange` on model input change', () => {
      const fixture = renderComponent({
        fields: [{ key: 'title', type: 'input' }],
      });

      const app = fixture.componentInstance;
      spyOn(app, 'modelChange');

      app.model = { title: '****' };
      fixture.detectChanges();

      expect(app.modelChange).not.toHaveBeenCalled();
    });
  });

  describe('form input', () => {
    it('should rebuild field when form is changed', () => {
      const fixture = renderComponent({
        model: { test: 'test' },
        form: new FormGroup({}),
        fields: [
          {
            key: 'test',
            type: 'input',
          },
        ],
      });

      const app = fixture.componentInstance;
      expect(app.form.get('test').value).toEqual('test');

      fixture.componentInstance.form = new FormGroup({});
      fixture.detectChanges();
      expect(app.form.get('test').value).toEqual('test');
    });

    it('should allow passing FormArray', () => {
      const fixture = renderComponent({
        model: ['test'],
        form: new FormArray([]),
        options: {},
        fields: [
          {
            key: '0',
            type: 'input',
          },
        ],
      });

      const form = fixture.componentInstance.form as FormArray;
      expect(form.at(0).value).toEqual('test');
    });
  });

  describe('`updateOn` support', () => {
    it('on blur', () => {
      const fixture = renderComponent({
        fields: [
          {
            key: 'name',
            type: 'input',
            modelOptions: { updateOn: 'blur' },
          },
        ],
      });

      const app = fixture.componentInstance;
      const input = fixture.debugElement.query(By.css('input'));

      expect(app.form.get('name').value).toBeNull();

      input.nativeElement.value = 'First';
      input.nativeElement.dispatchEvent(newEvent('input', false));
      fixture.detectChanges();

      expect(app.form.get('name').value).toBeNull();

      input.triggerEventHandler('blur', {});
      fixture.detectChanges();

      expect(app.form.get('name').value).toEqual('First');
    });

    it('on submit', () => {
      const fixture = renderComponent({
        fields: [
          {
            key: 'name',
            type: 'input',
            modelOptions: { updateOn: 'submit' },
          },
        ],
      });

      const app = fixture.componentInstance;
      const input = fixture.debugElement.query(By.css('input'));

      expect(app.form.get('name').value).toBeNull();
      input.nativeElement.value = 'First';
      input.nativeElement.dispatchEvent(newEvent('input', false));

      input.triggerEventHandler('blur', {});
      fixture.detectChanges();

      expect(app.form.get('name').value).toBeNull();

      const form = fixture.debugElement.query(By.css('form')) as DebugElement;
      form.triggerEventHandler('submit', {});
      fixture.detectChanges();

      expect(app.form.get('name').value).toEqual('First');
    });
  });

  describe('component-level injectors', () => {
    it('should inject parent service to child type', () => {
      // should inject `ParentService` in `ChildComponent` without raising an error
      renderComponent({
        fields: [
          {
            type: 'parent',
            fieldGroup: [
              {
                type: 'child',
                fieldGroup: [{ key: 'email' }],
              },
            ],
          },
        ],
      });
    });

    it('should throw an error if child has no parent', () => {
      const createComponent = () =>
        renderComponent({
          fields: [
            {
              type: 'child',
              fieldGroup: [{ key: 'email', type: 'text' }],
            },
          ],
        });

      expect(createComponent).toThrowError(/No provider for ParentService!/i);
    });
  });
});

@Injectable()
export class ParentService {}

@Component({
  selector: 'formly-parent',
  template: `
    <ng-content></ng-content>
  `,
  providers: [ParentService],
})
export class ParentComponent {
  constructor(public parent: ParentService) {}
}

@Component({
  selector: 'formly-child',
  template: `
    <ng-content></ng-content>
  `,
})
export class ChildComponent {
  constructor(public parent: ParentService) {}
}
