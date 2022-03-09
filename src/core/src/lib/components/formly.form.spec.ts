import { fakeAsync, tick } from '@angular/core/testing';
import { FormlyInputModule, createComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
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
    modelChange: (model) => {},
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
    imports: [FormlyInputModule],
    ...config,
  });
};

const FORMLY_FORM_SELECTOR = 'formly-form';
const FORMLY_FIELDS_SELECTOR = 'formly-form > formly-field * > formly-field';

describe('FormlyForm Component', () => {
  describe('fields input', () => {
    it('should render fields', () => {
      const { query, queryAll } = renderComponent({
        fields: [{ key: 'foo' }, { key: 'bar' }],
      });

      expect(query(FORMLY_FORM_SELECTOR)).not.toBeNull();
      expect(queryAll(FORMLY_FIELDS_SELECTOR)).toHaveLength(2);
    });

    it('should detect fields changes', () => {
      const { queryAll, setInputs, detectChanges } = renderComponent({ fields: null });
      expect(queryAll(FORMLY_FIELDS_SELECTOR)).toHaveLength(0);

      setInputs({ fields: [{ key: 'foo' }] });
      detectChanges();

      expect(queryAll(FORMLY_FIELDS_SELECTOR)).toHaveLength(1);
    });

    it('should not throw an error when fields is null', () => {
      const { query, queryAll } = renderComponent({ fields: null });

      expect(query(FORMLY_FORM_SELECTOR)).not.toBeNull();
      expect(queryAll(FORMLY_FIELDS_SELECTOR)).toHaveLength(0);
    });

    it('should update validation on fields input change', () => {
      const { form, setInputs } = renderComponent({ fields: [{ key: 'name' }] });

      expect(form.valid).toEqual(true);

      setInputs({
        fields: [{ key: 'name', templateOptions: { required: true } }],
      });

      expect(form.valid).toEqual(false);
    });

    it('should update validation of root form on fields input change', () => {
      const { form, setInputs } = renderComponent({});
      expect(form.valid).toEqual(true);

      setInputs({
        fields: [
          {
            fieldGroup: [{ key: 'name' }],
            validators: { e: { expression: () => false } },
          },
        ],
      });

      expect(form.valid).toEqual(false);
    });

    it('should call the validation only once during build', () => {
      const fooValidator = { expression: () => false };
      const spy = jest.spyOn(fooValidator, 'expression');
      const { form, setInputs, detectChanges, fields } = renderComponent({
        form: new FormGroup({}),
        fields: [
          { key: 'f1', validators: { fooValidator } },
          { key: 'f2' },
          { key: 'f3', fieldGroup: [{ key: 'f4' }] },
        ],
      });

      // re-build model change
      spy.mockReset();
      setInputs({ model: { f1: 'foo' } });
      expect(fooValidator.expression).toHaveBeenCalledTimes(1);

      // attach new field
      spy.mockReset();
      setInputs({
        fields: [
          // usage of [formControl] input which trigger FormGroupDirective::_updateTreeValidity call.
          { key: 'f4', type: 'input' },
          ...fields,
        ],
      });
      expect(fooValidator.expression).toHaveBeenCalledTimes(1);
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

    it('should take account of using the emitted modelChange value as model input', () => {
      const { form, model, detectChanges } = renderComponent(
        {
          model: {},
          fields: [{ key: 'test', type: 'input' }],
        },
        {
          template:
            '<formly-form [form]="form" [fields]="fields" [model]="model" (modelChange)="model = $event"></formly-form>',
        },
      );

      form.get('test').setValue('1');
      detectChanges();

      form.get('test').setValue('12');
      detectChanges();

      expect(model.test).toEqual('12');
      expect(form.get('test').value).toEqual('12');
    });

    it('should not emit `modelChange` on model input change', () => {
      const { fixture, setInputs } = renderComponent({
        fields: [{ key: 'title', type: 'input' }],
      });

      const app = fixture.componentInstance;
      jest.spyOn(app, 'modelChange');

      setInputs({ model: { title: '****' } });

      expect(app.modelChange).not.toHaveBeenCalled();
    });

    it('should not emit `modelChange` on a field without key changes', () => {
      const { fixture, fields, setInputs } = renderComponent({ fields: [{}] });
      const app = fixture.componentInstance;
      jest.spyOn(app, 'modelChange');

      fields[0].formControl.setValue('foo');
      fixture.detectChanges();

      expect(app.modelChange).not.toHaveBeenCalled();
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
      const { fixture } = renderComponent({
        fields: [{ key: 'title', type: 'input' }],
      });

      const app = fixture.componentInstance;
      jest.spyOn(app, 'modelChange');

      app.form.get('title').patchValue('***');
      fixture.detectChanges();

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
      jest.spyOn(app, 'modelChange');

      setInputs({ model: { title: '****' } });

      expect(app.modelChange).not.toHaveBeenCalled();
    });

    it('should eval expressions before emitting `modelChange`', () => {
      const { fixture } = renderComponent(
        {
          fields: [
            { key: 'foo' },
            {
              key: 'bar',
              hideExpression: '!model.foo',
            },
          ],
        },
        { extras: { checkExpressionOn: 'modelChange' } },
      );

      const app = fixture.componentInstance;
      let barControl = null;
      app.modelChange = () => (barControl = app.form.get('bar'));

      app.form.get('foo').patchValue('***');
      fixture.detectChanges();

      expect(barControl).not.toBeNull();
    });

    it('should detect changes before emitting `modelChange`', fakeAsync(() => {
      const { fields } = renderComponent({
        fields: [
          {
            key: 'foo',
            hideExpression: '!!model.bar',
            hooks: {
              // Changing `field.hide` during `afterViewInit` throw the following error:
              // Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'display: '. Current value: 'display: none'.
              afterViewInit: (f) => f.form.get('bar').setValue('ops'),
            },
          },
          { key: 'bar' },
        ],
      });

      tick();
      expect(fields[0].hide).toBeTrue();
    }));

    it('should reset field before eval expressions', () => {
      const { form, model, fields } = renderComponent(
        {
          fields: [
            {
              key: 'foo',
              defaultValue: 'foo',
            },
            {
              key: 'bar',
              hideExpression: '!model.foo',
              defaultValue: 'bar',
            },
          ],
        },
        { extras: { checkExpressionOn: 'modelChange' } },
      );

      form.reset();
      expect(model.bar).toBeUndefined();
      expect(fields[1].formControl.value).toBeUndefined();
    });

    it('should hide/display field using a function with nested field key', () => {
      const { form, model, fields, detectChanges, setInputs } = renderComponent({
        model: { address: [{ city: '' }] },
        fields: [
          {
            key: 'address[0].city',
            hideExpression: '!(model.address?.[0]?.city === "agadir")',
          },
        ],
      });

      expect(form.get('address.0.city')).toBeNull();

      setInputs({ model: { address: [{ city: 'agadir' }] } });
      detectChanges();

      expect(form.get('address.0.city')).not.toBeNull();
      expect(form.get('address.0.city').value).toEqual('agadir');
    });

    it('should support passing number or array path to field key', () => {
      const { model } = renderComponent({
        fields: [
          { key: 1, defaultValue: 'number' },
          { key: ['this:is:a:valid:property:for:a:json:object:1.0'], defaultValue: 'array' },
        ],
      });

      expect(model).toEqual({
        1: 'number',
        'this:is:a:valid:property:for:a:json:object:1.0': 'array',
      });
    });
  });

  describe('check expression', () => {
    it('should check expression on valueChanges', () => {
      const { form, fields, detectChanges } = renderComponent({
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
      detectChanges();
      expect(fields[0].className).toEqual('***');
    });

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
      jest.spyOn(app, 'modelChange');

      app.form.get('title').patchValue('***');
      detectChanges();

      expect(app.modelChange).toHaveBeenCalledTimes(1);
      expect(app.modelChange).toHaveBeenCalledWith({ title: '***' });
      expect(app.model).toEqual({});
    });

    it('should take account of inputs changes', () => {
      const { form, fields, model, setInputs } = renderComponent(
        {
          fields: [{ key: 'title', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      let titleField;
      setInputs({
        model: { title: 'foo' },
        fields: [{ key: 'title', hooks: { onInit: (f) => (titleField = f) } }],
      });

      expect(model).not.toBe(titleField.model);
      expect(fields[0]).not.toBe(titleField);
      expect(titleField.model).toEqual({ title: 'foo' });
      expect(form.value).toEqual({ title: 'foo' });
    });
  });

  describe('resetFieldOnHide', () => {
    it('should set default value when hide is false', () => {
      const { model } = renderComponent(
        {
          fields: [{ key: 'foo', defaultValue: 'test' }],
        },
        { extras: { resetFieldOnHide: true } },
      );

      expect(model).toEqual({ foo: 'test' });
    });

    it('should not set default value clear on hide', () => {
      const { model } = renderComponent(
        {
          fields: [{ key: 'foo', defaultValue: 'test', hide: true }],
        },
        { extras: { resetFieldOnHide: true } },
      );

      expect(model).toEqual({});
    });

    it('should toggle default value on hide changes', () => {
      const { model, fields, detectChanges } = renderComponent(
        {
          fields: [{ key: 'foo', defaultValue: 'test' }],
        },
        { extras: { resetFieldOnHide: true } },
      );

      fields[0].hide = true;
      detectChanges();
      expect(model).toEqual({});

      fields[0].hide = false;
      detectChanges();
      expect(model).toEqual({ foo: 'test' });
    });

    it('should delete prop when default value is undefined', () => {
      const { model } = renderComponent(
        {
          fields: [
            { key: 'foo', defaultValue: null },
            { key: 'bar', defaultValue: undefined },
          ],
        },
        { extras: { resetFieldOnHide: true } },
      );

      expect(model).toEqual({ foo: null });
    });

    it('should toggle default value on hide changes for nested config', () => {
      const { fields, model, detectChanges } = renderComponent(
        {
          fields: [
            {
              key: 'foo',
              fieldGroup: [{ key: 'bar', defaultValue: 'test' }],
            },
          ],
        },
        { extras: { resetFieldOnHide: true } },
      );

      fields[0].hide = true;
      detectChanges();
      expect(model).toEqual({});

      fields[0].hide = false;
      detectChanges();
      expect(model).toEqual({ foo: { bar: 'test' } });
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

      inputDebugEl.triggerEventHandler('input', ɵCustomEvent({ value: 'First' }));
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
      inputDebugEl.triggerEventHandler('input', ɵCustomEvent({ value: 'First' }));

      inputDebugEl.triggerEventHandler('blur', {});
      detectChanges();

      expect(form.get('name').value).toBeUndefined();

      query('form').triggerEventHandler('submit', {});
      detectChanges();

      expect(form.get('name').value).toEqual('First');
    });
  });

  describe('inline type', () => {
    it('should render inline type', () => {
      const { query } = renderComponent(
        {
          fields: [
            {
              type: 'inline-type',
              templateOptions: { label: 'inline-type-label' },
            },
          ],
        },
        {
          template: `
            <formly-form [fields]="fields">
              <ng-template formlyTemplate="inline-type" let-field>
                <div id="inline-type">{{ field.templateOptions.label }}</div>
              </ng-template>
            </formly-form>
          `,
        },
      );

      expect(query('#inline-type')).not.toBeNull();
      expect(query('#inline-type').nativeElement.textContent).toEqual('inline-type-label');
    });

    it('should override existing type', () => {
      const { query } = renderComponent(
        {
          fields: [{ type: 'input' }],
        },
        {
          template: `
            <formly-form [fields]="fields">
              <ng-template formlyTemplate="input" let-field>
                <div id="inline-input"></div>
              </ng-template>
            </formly-form>
          `,
        },
      );

      expect(query('#inline-input')).not.toBeNull();
      expect(query('input')).toBeNull();
    });

    it('should override default formly-group', () => {
      const { query, queryAll } = renderComponent(
        {
          fields: [
            {
              fieldGroup: [{ fieldGroup: [{ type: 'input' }] }],
            },
          ],
        },
        {
          template: `
            <formly-form [fields]="fields">
              <ng-template formlyTemplate let-f>
                <div class="inline-group">
                  <formly-field *ngFor="let field of f.fieldGroup" [field]="field"></formly-field>
                </div>
              </ng-template>
            </formly-form>
          `,
        },
      );

      expect(queryAll('.inline-group')).toHaveLength(3);
      expect(query('formly-group')).toBeNull();
    });
  });

  it('should check expression on submit', () => {
    const { fields, query, detectChanges } = renderComponent(
      {
        fields: [
          {
            key: 'name',
            type: 'input',
            hideExpression: 'field.options.parentForm.submitted',
          },
        ],
      },
      { extras: { checkExpressionOn: 'modelChange' } },
    );

    expect(fields[0].hide).toBeFalse();

    query('form').triggerEventHandler('submit', {});
    detectChanges();

    expect(fields[0].hide).toBeTrue();
  });

  it('should keep in sync UI on checkExpressionChange', () => {
    const { form, query, fields, fixture, detectChanges } = renderComponent(
      {
        fields: [
          {
            key: 'city',
            type: 'input',
            expressionProperties: {
              'templateOptions.disabled': 'model.city === "***"',
            },
          },
        ],
      },
      { extras: { immutable: true } },
    );

    const input = query('input');
    input.triggerEventHandler('input', ɵCustomEvent({ value: '***' }));
    fixture.autoDetectChanges();

    const control = form.get('city');
    expect(control.disabled).toBeTrue();
    expect(input.attributes.disabled).toEqual('disabled');
  });

  it('should keep disabled state of field group consistent after detect changes', () => {
    const {
      fields: [field],
      setInputs,
      detectChanges,
    } = renderComponent({
      fields: [
        {
          key: 'f1',
          fieldGroup: [
            { key: 's1', templateOptions: { disabled: true } },
            { key: 's2', templateOptions: { disabled: false } },
          ],
        },
      ],
    });

    expect(field.templateOptions.disabled).toEqual(false);
    expect(field.fieldGroup[0].templateOptions.disabled).toEqual(true);
    expect(field.fieldGroup[1].templateOptions.disabled).toEqual(false);

    setInputs({ model: {} });
    detectChanges();

    expect(field.templateOptions.disabled).toEqual(false);
    expect(field.fieldGroup[0].templateOptions.disabled).toEqual(true);
    expect(field.fieldGroup[1].templateOptions.disabled).toEqual(false);
  });

  it('should detect changes when building a child field', () => {
    const { form, fields, options, detectChanges } = renderComponent(
      { fields: [{ fieldGroup: [{ key: 'bar', type: 'input' }] }] },
      {
        template: `
          <form [formGroup]="form">
            <formly-form
              [model]="model"
              [fields]="fields"
              [options]="options"
              [form]="form"
              (modelChange)="modelChange($event)">
            </formly-form>
            <button type="submit" [disabled]="!form.valid">Submit</button>
          </form>
        `,
      },
    );

    fields[0].fieldGroup.push({ key: 'foo', type: 'input', templateOptions: { required: true } });
    options.build(fields[0]);
    // NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value for 'disabled': 'false'. Current value: 'true'
    expect(detectChanges).not.toThrowError(/ExpressionChangedAfterItHasBeenCheckedError/);
    expect(form.valid).toBeFalse();
  });
});
