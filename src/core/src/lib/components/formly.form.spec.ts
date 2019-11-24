import { fakeAsync, tick } from '@angular/core/testing';
import { FormlyInputModule, createComponent } from '@ngx-formly/core/testing';
import { Component, Injectable } from '@angular/core';
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

const FORMLY_FORM_SELECTOR = 'formly-form';
const FORMLY_FIELDS_SELECTOR = 'formly-form > formly-field';

describe('FormlyForm Component', () => {
  describe('fields input', () => {
    it('should render fields', () => {
      const { query, queryAll } = renderComponent({
        fields: [{ key: 'foo' }, { key: 'bar' }],
      });

      expect(query(FORMLY_FORM_SELECTOR)).not.toBeNull();
      expect(queryAll(FORMLY_FIELDS_SELECTOR)).toHaveLength(2);
    });

    it('should not throw an error when fields is null', () => {
      const { query, queryAll } = renderComponent({ fields: null });

      expect(query(FORMLY_FORM_SELECTOR)).not.toBeNull();
      expect(queryAll(FORMLY_FIELDS_SELECTOR)).toHaveLength(0);
    });
  });

  describe('model input', () => {
    it('should update the form value on model change', () => {
      const { form, setInputs } = renderComponent({
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
      expect(form.value).toEqual({ title: undefined });

      setInputs({ model: { title: '***' } });
      expect(form.value).toEqual({ title: '***' });
    });

    it('fallback to undefined for an non-existing member', () => {
      const { form, setInputs } = renderComponent({
        model: { aa: { test: 'aaa' } },
        fields: [
          {
            key: 'aa',
            fieldGroup: [{ key: 'test', type: 'input' }],
          },
        ],
      });

      expect(form.value).toEqual({ aa: { test: 'aaa' } });

      setInputs({ model: {} });
      expect(form.value).toEqual({ aa: { test: undefined } });
    });
  });

  describe('form input', () => {
    it('should rebuild field when form is changed', () => {
      const { form, setInputs } = renderComponent({
        model: { test: 'test' },
        form: new FormGroup({}),
        fields: [
          {
            key: 'test',
            type: 'input',
          },
        ],
      });

      expect(form.get('test').value).toEqual('test');

      setInputs({ form: new FormGroup({}) });
      expect(form.get('test').value).toEqual('test');
    });

    it('should allow passing FormArray', () => {
      const { form } = renderComponent({
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

      expect((form as FormArray).at(0).value).toEqual('test');
    });
  });

  describe('modelChange output', () => {
    it('should emit `modelChange` on valueChanges', () => {
      const { detectChanges, fixture } = renderComponent({
        fields: [{ key: 'title', type: 'input' }],
      });

      const app = fixture.componentInstance;
      spyOn(app, 'modelChange');

      app.form.get('title').patchValue('***');
      detectChanges();

      expect(app.modelChange).toHaveBeenCalledTimes(1);
      expect(app.modelChange).toHaveBeenCalledWith({ title: '***' });
    });

    it('should not emit `modelChange` on inputs change', () => {
      const { fixture, setInputs } = renderComponent({
        fields: [
          {
            key: 'title',
            type: 'input',
            expressionProperties: {
              'templateOptions.disabled': 'model.title === "****"',
            },
          },
        ],
      });

      const app = fixture.componentInstance;
      spyOn(app, 'modelChange');

      setInputs({ model: { title: '****' } });

      expect(app.modelChange).not.toHaveBeenCalled();
    });
  });

  describe('check expression', () => {
    it('should check expression on valueChanges', fakeAsync(() => {
      const { form, fields } = renderComponent({
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

      form.get('title').patchValue('***');
      tick();
      expect(fields[0].className).toEqual('***');
    }));

    it('should check expression on valueChanges only', () => {
      const { detectChanges, model, fields } = renderComponent(
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

      model.title = '***';
      detectChanges();
      expect(fields[0].className).toBeUndefined();
    });
  });

  describe('immutable option', () => {
    it('should render', () => {
      const { query, queryAll } = renderComponent(
        {
          fields: [{ key: 'foo', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      expect(query(FORMLY_FORM_SELECTOR)).not.toBeNull();
      expect(queryAll(FORMLY_FIELDS_SELECTOR)).toHaveLength(1);
    });

    it('should not change inputs', () => {
      const { options, fields, model } = renderComponent(
        {
          fields: [{ key: 'city', defaultValue: 'test' }],
        },
        { extras: { immutable: true } },
      );

      expect(options).toEqual({});
      expect(fields[0]).toEqual({ key: 'city', defaultValue: 'test' });
      expect(model).toEqual({});
    });

    it('should emit `modelChange`', () => {
      const { fixture, detectChanges } = renderComponent(
        {
          fields: [{ key: 'title', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      const app = fixture.componentInstance;
      spyOn(app, 'modelChange');

      app.form.get('title').patchValue('***');
      detectChanges();

      expect(app.modelChange).toHaveBeenCalledTimes(1);
      expect(app.modelChange).toHaveBeenCalledWith({ title: '***' });
      expect(app.model).toEqual({});
    });

    it('should take account of inputs changes`', () => {
      const { form, fields, model, setInputs } = renderComponent(
        {
          fields: [{ key: 'title', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      let titleField;
      setInputs({
        model: { title: 'foo' },
        fields: [{ key: 'title', hooks: { onInit: f => (titleField = f) } }],
      });

      expect(model).not.toBe(titleField.model);
      expect(fields[0]).not.toBe(titleField);
      expect(titleField.model).toEqual({ title: 'foo' });
      expect(form.value).toEqual({ title: 'foo' });
    });
  });

  describe('`updateOn` support', () => {
    it('on blur', () => {
      const { query, detectChanges, form } = renderComponent({
        fields: [
          {
            key: 'name',
            type: 'input',
            modelOptions: { updateOn: 'blur' },
          },
        ],
      });

      const inputDebugEl = query('input');

      expect(form.get('name').value).toBeUndefined();

      inputDebugEl.triggerEventHandler('input', { target: { value: 'First' } });
      detectChanges();

      expect(form.get('name').value).toBeUndefined();

      inputDebugEl.triggerEventHandler('blur', {});
      detectChanges();

      expect(form.get('name').value).toEqual('First');
    });

    it('on submit', () => {
      const { query, detectChanges, form } = renderComponent({
        fields: [
          {
            key: 'name',
            type: 'input',
            modelOptions: { updateOn: 'submit' },
          },
        ],
      });

      const inputDebugEl = query('input');

      expect(form.get('name').value).toBeUndefined();
      inputDebugEl.triggerEventHandler('input', { target: { value: 'First' } });

      inputDebugEl.triggerEventHandler('blur', {});
      detectChanges();

      expect(form.get('name').value).toBeUndefined();

      query('form').triggerEventHandler('submit', {});
      detectChanges();

      expect(form.get('name').value).toEqual('First');
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
