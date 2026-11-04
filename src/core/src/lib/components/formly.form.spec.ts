import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormlyInputModule, createComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import {
  FieldType,
  FormlyAttributes,
  FieldTypeConfig,
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
  provideFormlyConfig,
  provideFormlyCore,
} from '@ngx-formly/core';
import { FormGroup, FormArray, FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyOnPushComponent } from './formly.field.spec';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  NgZone,
  provideExperimentalZonelessChangeDetection as provideZonelessChangeDetection,
  signal,
} from '@angular/core';

type IFormlyFormInputs = Partial<{
  form: FormGroup | FormArray;
  fields: FormlyFieldConfig[];
  options: FormlyFormOptions;
  model: any;
  modelChange: (m: any) => void;
}>;

export const renderComponent = (inputs: IFormlyFormInputs, config: any = {}) => {
  inputs = {
    form: new FormGroup({}),
    model: {},
    options: {},
    fields: [],
    modelChange: () => {},
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
    declarations: [FormlyOnPushComponent],
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
        fields: [{ key: 'name', props: { required: true } }],
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
      const { setInputs, fields } = renderComponent({
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
            expressions: {
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
      const { fixture, fields } = renderComponent({ fields: [{}] });
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

  describe('model input as a WritableSignal', () => {
    it('should set a copy of the model on the signal after each change', () => {
      const model = signal<any>({ title: 'foo' });
      const { form, detectChanges } = renderComponent({
        model,
        fields: [{ key: 'title', type: 'input' }],
      });

      const initial = model();
      form.get('title').setValue('bar');
      detectChanges();

      expect(model()).toEqual({ title: 'bar' });
      expect(model()).not.toBe(initial);
    });

    it('should set nested keyed group changes on the signal', () => {
      const model = signal<any>({ address: { city: 'foo' } });
      const { form, detectChanges } = renderComponent({
        model,
        fields: [{ key: 'address', fieldGroup: [{ key: 'city', type: 'input' }] }],
      });

      form.get('address.city').setValue('bar');
      detectChanges();

      expect(model()).toEqual({ address: { city: 'bar' } });
    });

    it('should keep model properties without a field', () => {
      const model = signal<any>({ id: 1, title: 'foo' });
      const { form, detectChanges } = renderComponent({
        model,
        fields: [{ key: 'title', type: 'input' }],
      });

      form.get('title').setValue('bar');
      detectChanges();

      expect(model()).toEqual({ id: 1, title: 'bar' });
    });

    it('should rebuild the form when the host sets a new value', () => {
      const model = signal<any>({ title: 'foo' });
      const { form, detectChanges } = renderComponent({
        model,
        fields: [{ key: 'title', type: 'input' }],
      });

      model.set({ title: 'baz' });
      detectChanges();

      expect(form.get('title').value).toEqual('baz');
    });

    it('should set a copy of the model on the signal with the immutable option', () => {
      const model = signal<any>({ title: 'foo' });
      const { form, detectChanges } = renderComponent(
        {
          model,
          fields: [{ key: 'title', type: 'input' }],
        },
        { extras: { immutable: true } },
      );

      form.get('title').setValue('bar');
      detectChanges();

      expect(model()).toEqual({ title: 'bar' });
    });

    it.each([false, true])(
      'should rebuild the form when the host resets the signal to its original value with immutable=%s',
      (immutable) => {
        const initial = { title: 'foo' };
        const model = signal<any>(initial);
        const { form, detectChanges } = renderComponent(
          { model, fields: [{ key: 'title', type: 'input' }] },
          { extras: { immutable } },
        );

        form.get('title').setValue('bar');
        detectChanges();
        model.set(initial);
        detectChanges();

        expect(form.get('title').value).toEqual('foo');
      },
    );

    it('should not mutate the initial object held by the signal', () => {
      const initial = { title: 'foo', address: { city: 'foo' } };
      const model = signal<any>(initial);
      const { form, detectChanges } = renderComponent({
        model,
        fields: [
          { key: 'title', type: 'input' },
          { key: 'address', fieldGroup: [{ key: 'city', type: 'input' }] },
        ],
      });

      form.get('title').setValue('bar');
      form.get('address.city').setValue('bar');
      detectChanges();
      expect(initial).toEqual({ title: 'foo', address: { city: 'foo' } });
    });

    it('should not mutate an object the host sets on the signal later', () => {
      const model = signal<any>({ title: 'foo', address: { city: 'foo' } });
      const { form, detectChanges } = renderComponent({
        model,
        fields: [
          { key: 'title', type: 'input' },
          { key: 'address', fieldGroup: [{ key: 'city', type: 'input' }] },
        ],
      });

      const loaded = { title: 'baz', address: { city: 'baz' } };
      model.set(loaded);
      detectChanges();
      form.get('title').setValue('qux');
      detectChanges();

      expect(loaded).toEqual({ title: 'baz', address: { city: 'baz' } });
      expect(model()).toEqual({ title: 'qux', address: { city: 'baz' } });
    });

    it('should set a newly chosen file on the signal', () => {
      const chosen = new File([], 'a.txt');
      const model = signal<any>({ file: new File([], 'a.txt') });
      const { form, detectChanges } = renderComponent({ model, fields: [{ key: 'file' }] });

      form.get('file').setValue(chosen);
      detectChanges();

      expect(model().file).toBe(chosen);
    });

    it('should give expressions that read the signal the latest edit', async () => {
      const model = signal<any>({ title: 'foo' });
      const { form, fields, fixture } = renderComponent({
        model,
        fields: [{ key: 'title', type: 'input', expressions: { 'props.placeholder': () => model().title } }],
      });

      form.get('title').setValue('bar');
      // Angular 18 only emits `onStable` (which runs the expressions) once the fixture is stable
      await fixture.whenStable();

      expect(fields[0].props.placeholder).toEqual('bar');
    });

    it.each([false, true])(
      'should keep an edit when the host updates the signal in the same task with zoneless=%s',
      async (zoneless) => {
        const model = signal<any>({ title: 'foo' });
        const { fixture } = createComponent({
          template: `<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>`,
          inputs: { form: new UntypedFormGroup({}), fields: [{ key: 'title', type: 'input' }], model },
          imports: [FormlyInputModule],
          providers: zoneless ? [provideZonelessChangeDetection()] : [],
        });
        fixture.autoDetectChanges();
        await fixture.whenStable();

        TestBed.inject(NgZone).run(() => {
          fixture.componentInstance.form.get('title').setValue('bar');
          model.update((m) => ({ ...m, count: 1 }));
        });
        await fixture.whenStable();

        expect(fixture.componentInstance.form.get('title').value).toEqual('bar');
        expect(model()).toEqual({ title: 'bar', count: 1 });
      },
    );

    it.each([false, true])('should set build-time default values on the signal with zoneless=%s', async (zoneless) => {
      const model = signal<any>({});
      const modelChange = jest.fn();
      const { fixture } = createComponent({
        template: `<formly-form [form]="form" [fields]="fields" [model]="model" (modelChange)="modelChange($event)"></formly-form>`,
        inputs: {
          form: new FormGroup({}),
          fields: [{ key: 'country', type: 'input', defaultValue: 'CH' }],
          model,
          modelChange,
        },
        imports: [FormlyInputModule],
        providers: zoneless ? [provideZonelessChangeDetection()] : [],
      });
      fixture.autoDetectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.form.value).toEqual({ country: 'CH' });
      expect(model()).toEqual({ country: 'CH' });
      expect(modelChange).not.toHaveBeenCalled();
    });

    it.each([false, true])(
      'should keep initially hidden values on the signal like a plain model with zoneless=%s',
      async (zoneless) => {
        const model = signal<any>({ title: 'hidden' });
        const { fixture } = createComponent({
          template: `<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>`,
          inputs: { form: new FormGroup({}), fields: [{ key: 'title', type: 'input', hide: true }], model },
          imports: [FormlyInputModule],
          providers: zoneless ? [provideZonelessChangeDetection()] : [],
        });
        fixture.autoDetectChanges();
        await fixture.whenStable();

        expect(fixture.componentInstance.form.value).toEqual({});
        expect(model()).toEqual({ title: 'hidden' });
      },
    );

    it.each([false, true])(
      'should keep a value set by the host before it is applied with zoneless=%s',
      async (zoneless) => {
        const model = signal<any>({ id: 1, title: 'foo' });
        const { fixture } = createComponent({
          template: `<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>`,
          inputs: { form: new UntypedFormGroup({}), fields: [{ key: 'title', type: 'input' }], model },
          imports: [FormlyInputModule],
          providers: zoneless ? [provideZonelessChangeDetection()] : [],
        });
        fixture.autoDetectChanges();
        await fixture.whenStable();

        model.set({ id: 2, title: 'loaded' });
        fixture.componentInstance.form.get('title').setValue('adjusted');
        await fixture.whenStable();

        expect(model()).toEqual({ id: 2, title: 'loaded' });
        expect(fixture.componentInstance.form.get('title').value).toEqual('loaded');
      },
    );

    it.each([false, true])('should settle when two forms share one signal with zoneless=%s', async (zoneless) => {
      const model = signal<any>({ a: 'foo' });
      const { fixture } = createComponent({
        template: `
          <formly-form [form]="form1" [fields]="fields1" [model]="model"></formly-form>
          <formly-form [form]="form2" [fields]="fields2" [model]="model"></formly-form>
        `,
        inputs: {
          form1: new UntypedFormGroup({}),
          form2: new FormGroup({}),
          fields1: [{ key: 'a', type: 'input' }],
          fields2: [{ key: 'b', type: 'input', defaultValue: 'bar' }],
          model,
        },
        imports: [FormlyInputModule],
        providers: zoneless ? [provideZonelessChangeDetection()] : [],
      });
      fixture.autoDetectChanges();
      await fixture.whenStable();

      expect(model()).toEqual({ a: 'foo', b: 'bar' });

      fixture.componentInstance.form1.get('a').setValue('edited');
      await fixture.whenStable();

      expect(model()).toEqual({ a: 'edited', b: 'bar' });
      expect(fixture.componentInstance.form2.get('b').value).toEqual('bar');
    });

    it.each([false, true])(
      'should settle when the fields are computed from the signal with zoneless=%s',
      async (zoneless) => {
        const model = signal<any>({ type: 'a' });
        const fields = computed(() => [
          { key: 'type', type: 'input' },
          { key: `extra_${model().type}`, type: 'input' },
        ]);
        const { fixture } = createComponent({
          template: `<formly-form [form]="form" [fields]="fields()" [model]="model"></formly-form>`,
          inputs: { form: new UntypedFormGroup({}), fields, model },
          imports: [FormlyInputModule],
          providers: zoneless ? [provideZonelessChangeDetection()] : [],
        });
        fixture.autoDetectChanges();
        await fixture.whenStable();

        fixture.componentInstance.form.get('type').setValue('b');
        await fixture.whenStable();

        expect(model()).toEqual({ type: 'b' });
        expect(fixture.componentInstance.form.get('extra_b')).not.toBeNull();
      },
    );

    it('should keep a null signal value when the build leaves the model empty', () => {
      const model = signal<any>(null);
      const { form, detectChanges } = renderComponent({ model, fields: [{ key: 'title', type: 'input' }] });
      expect(model()).toBeNull();

      form.get('title').setValue('foo');
      detectChanges();
      expect(model()).toEqual({ title: 'foo' });
    });

    it('should keep syncing a signal that has a custom equal function', () => {
      const model = signal<any>({ title: 'foo' }, { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) });
      const { form, detectChanges } = renderComponent({ model, fields: [{ key: 'title', type: 'input' }] });

      form.get('title').setValue('bar');
      detectChanges();
      form.get('title').setValue('baz');
      detectChanges();
      expect(model()).toEqual({ title: 'baz' });

      model.set({ title: 'host' });
      detectChanges();
      expect(form.get('title').value).toEqual('host');
    });

    it('should set default values added by options.build() on the signal', () => {
      const model = signal<any>({ title: 'foo' });
      const fields: FormlyFieldConfig[] = [{ key: 'title', type: 'input' }];
      const { options, detectChanges } = renderComponent({ model, fields });

      fields.push({ key: 'country', type: 'input', defaultValue: 'CH' });
      options.build();
      detectChanges();

      expect(model()).toEqual({ title: 'foo', country: 'CH' });
    });

    it('should not make a host effect that calls options.build() depend on the signal', () => {
      const model = signal<any>({ title: 'foo' });
      const config = signal(1);
      const options: FormlyFormOptions = {};
      const { form, detectChanges } = renderComponent({ model, options, fields: [{ key: 'title', type: 'input' }] });
      let runs = 0;
      effect(
        () => {
          runs++;
          config();
          options.build();
        },
        { injector: TestBed.inject(Injector) },
      );
      TestBed.flushEffects();

      form.get('title').setValue('bar');
      detectChanges();
      TestBed.flushEffects();
      expect(runs).toEqual(1);
      expect(model()).toEqual({ title: 'bar' });

      config.set(2);
      TestBed.flushEffects();
      expect(runs).toEqual(2);
    });

    it('should write defaults to the signal when the host replaces the model', () => {
      const model = signal<any>({ title: 'foo' });
      const { fixture } = renderComponent({
        model,
        fields: [
          { key: 'title', type: 'input' },
          { key: 'country', type: 'input', defaultValue: 'CH' },
        ],
      });
      fixture.autoDetectChanges();
      TestBed.flushEffects();

      model.set({ title: 'bar' });
      TestBed.flushEffects();

      expect(model()).toEqual({ title: 'bar', country: 'CH' });
    });

    it('should write defaults to the signal from a host effect that calls options.build()', () => {
      const model = signal<any>({ title: 'foo' });
      const fields: FormlyFieldConfig[] = [{ key: 'title', type: 'input' }];
      const options: FormlyFormOptions = {};
      renderComponent({ model, options, fields });
      const trigger = signal(0);
      effect(
        () => {
          trigger();
          fields.push({ key: 'country', type: 'input', defaultValue: 'CH' });
          options.build();
        },
        { injector: TestBed.inject(Injector) },
      );

      TestBed.flushEffects();

      expect(model()).toEqual({ title: 'foo', country: 'CH' });
    });

    it('should not keep a reference to itself on the options after it is destroyed', () => {
      const options: FormlyFormOptions = {};
      const { fixture } = renderComponent({
        model: signal<any>({ title: 'foo' }),
        options,
        fields: [{ key: 'title', type: 'input' }],
      });

      fixture.destroy();

      expect((options as any)._afterBuild.size).toEqual(0);
    });

    it('should not keep a reference to itself on options that were replaced', () => {
      const options: FormlyFormOptions = {};
      const { setInputs } = renderComponent({
        model: signal<any>({ title: 'foo' }),
        options,
        fields: [{ key: 'title', type: 'input' }],
      });

      setInputs({ options: {} });

      expect((options as any)._afterBuild.size).toEqual(0);
    });

    it('should keep the build hook of another form that shares the options', () => {
      const options: FormlyFormOptions = {};
      const shared = signal<any>({ title: 'foo' });
      const { fixture, form1, form2 } = createComponent({
        template: `
          <formly-form [form]="form1" [fields]="fields1" [model]="model1" [options]="options"></formly-form>
          @if (showSecond) {
            <formly-form [form]="form2" [fields]="fields2" [model]="model2" [options]="options"></formly-form>
          }
        `,
        inputs: {
          form1: new FormGroup({}),
          form2: new FormGroup({}),
          fields1: [{ key: 'title', type: 'input' }] as FormlyFieldConfig[],
          fields2: [{ key: 'title', type: 'input' }],
          model1: shared,
          model2: { title: 'plain' },
          options,
          showSecond: true,
        },
        imports: [FormlyInputModule],
      });

      fixture.componentInstance.showSecond = false;
      fixture.detectChanges();
      fixture.componentInstance.fields1.push({ key: 'country', type: 'input', defaultValue: 'CH' });
      options.build();

      expect(shared()).toEqual({ title: 'foo', country: 'CH' });
      expect(form1.get('title').value).toEqual('foo');
      expect(form2.get('title').value).toEqual('plain');
    });

    it('should sync defaults from options.build() when two forms with signals share options', () => {
      const options: FormlyFormOptions = {};
      const sig1 = signal<any>({ a: 'foo' });
      const sig2 = signal<any>({ b: 'bar' });
      const { fields1, form1, detectChanges } = createComponent<any>({
        template: `
          <formly-form [form]="form1" [fields]="fields1" [model]="sig1" [options]="options"></formly-form>
          <formly-form [form]="form2" [fields]="fields2" [model]="sig2" [options]="options"></formly-form>
        `,
        inputs: {
          form1: new FormGroup({}),
          form2: new FormGroup({}),
          fields1: [{ key: 'a', type: 'input' }],
          fields2: [{ key: 'b', type: 'input' }],
          sig1,
          sig2,
          options,
        },
        imports: [FormlyInputModule],
      });

      form1.get('a').setValue('edited');
      detectChanges();
      fields1.push({ key: 'country', type: 'input', defaultValue: 'CH' });
      options.build();
      detectChanges();

      expect(form1.value).toEqual({ a: 'edited', country: 'CH' });
      expect(sig1()).toEqual({ a: 'edited', country: 'CH' });
    });

    it('should not set the signal again when the model contains NaN', () => {
      const model = signal<any>({ title: 'foo', n: NaN });
      const set = jest.spyOn(model, 'set');
      const { options, detectChanges } = renderComponent({ model, fields: [{ key: 'title', type: 'input' }] });

      set.mockClear();
      options.build();
      options.build();
      detectChanges();

      expect(set).not.toHaveBeenCalled();
    });

    it('should stop following the signal when a plain model is bound', () => {
      const model = signal<any>({ title: 'foo' });
      const { form, setInputs, detectChanges } = renderComponent({
        model,
        fields: [{ key: 'title', type: 'input' }],
      });

      setInputs({ model: { title: 'plain' } });
      model.set({ title: 'signal' });
      detectChanges();
      expect(form.get('title').value).toEqual('plain');

      form.get('title').setValue('bar');
      detectChanges();
      expect(model()).toEqual({ title: 'signal' });
    });

    it('should update a computed in an OnPush host as the user types', async () => {
      TestBed.configureTestingModule({
        imports: [SignalModelHostComponent],
        providers: [provideFormlyCore({ types: [{ name: 'input', component: FormlyFieldInput }] })],
      });
      const fixture = TestBed.createComponent(SignalModelHostComponent);
      fixture.autoDetectChanges();
      await fixture.whenStable();

      const [name, city] = fixture.nativeElement.querySelectorAll('input');
      name.value = 'Partners';
      name.dispatchEvent(new Event('input'));
      city.value = 'York';
      city.dispatchEvent(new Event('input'));
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('p').textContent).toBe('Partners (York)');
    });

    it.each([false, true])('should update a computed read in the host template with zoneless=%s', async (zoneless) => {
      const model = signal<any>({ title: 'foo' });
      const { fixture, query } = createComponent({
        template: `
          <p>{{ title() }}</p>
          <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
        `,
        inputs: {
          form: new FormGroup({}),
          fields: [{ key: 'title', type: 'input' }],
          model,
          title: computed(() => model().title),
        },
        imports: [FormlyInputModule],
        providers: zoneless ? [provideZonelessChangeDetection()] : [],
      });
      fixture.autoDetectChanges();
      await fixture.whenStable();

      const input = query<HTMLInputElement>('input').nativeElement;
      input.value = 'bar';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();

      expect(query('p').nativeElement.textContent).toBe('bar');
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
            expressions: {
              'props.disabled': 'model.title === "****"',
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
              expressions: { hide: '!model.foo' },
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
            expressions: { hide: '!!model.bar' },
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
              expressions: { hide: '!model.foo' },
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
      const { form, detectChanges, setInputs } = renderComponent({
        model: { address: [{ city: '' }] },
        fields: [
          {
            key: 'address[0].city',
            expressions: { hide: '!(model.address?.[0]?.city === "agadir")' },
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
            expressions: {
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
              expressions: {
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

      let titleField: FormlyFieldConfig;
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
              props: { label: 'inline-type-label' },
            },
          ],
        },
        {
          template: `
            <formly-form [fields]="fields">
              <ng-template formlyTemplate="inline-type" let-field>
                <div id="inline-type">{{ field.props.label }}</div>
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

  describe('formState update', () => {
    it('should take account of formState update', () => {
      const { options, query, detectChanges } = renderComponent({
        fields: [
          {
            key: 'push',
            type: FormlyOnPushComponent,
            props: {},
          },
        ],
        options: { formState: { foo: true } },
      });

      expect(query('.formState').nativeElement.textContent).toEqual(JSON.stringify({ foo: true }, null, 2));
      options.formState.foo = false;
      detectChanges();
      expect(query('.formState').nativeElement.textContent).toEqual(JSON.stringify({ foo: false }, null, 2));
    });

    it('should apply formState update to all fields', () => {
      const options = { formState: { foo: true } };
      const { query, detectChanges } = renderComponent({
        options,
        fields: [
          {
            fieldGroup: [
              {
                key: 'push',
                type: FormlyOnPushComponent,
              },
              {
                key: 'test',
              },
            ],
          },
        ],
      });

      expect(query('.formState').nativeElement.textContent).toEqual(JSON.stringify({ foo: true }, null, 2));

      options.formState.foo = false;
      detectChanges();
      expect(query('.formState').nativeElement.textContent).toEqual(JSON.stringify({ foo: false }, null, 2));
    });
  });

  it('should check expression on submit', () => {
    const { fields, query, detectChanges } = renderComponent(
      {
        fields: [
          {
            key: 'name',
            type: 'input',
            expressions: { hide: 'field.options.parentForm.submitted' },
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
    const { form, query, fixture } = renderComponent(
      {
        fields: [
          {
            key: 'city',
            type: 'input',
            expressions: {
              'props.disabled': 'model.city === "***"',
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
            { key: 's1', props: { disabled: true } },
            { key: 's2', props: { disabled: false } },
          ],
        },
      ],
    });

    expect(field.props.disabled).toEqual(false);
    expect(field.fieldGroup[0].props.disabled).toEqual(true);
    expect(field.fieldGroup[1].props.disabled).toEqual(false);

    setInputs({ model: {} });
    detectChanges();

    expect(field.props.disabled).toEqual(false);
    expect(field.fieldGroup[0].props.disabled).toEqual(true);
    expect(field.fieldGroup[1].props.disabled).toEqual(false);
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

    fields[0].fieldGroup.push({ key: 'foo', type: 'input', props: { required: true } });
    options.build(fields[0]);
    // NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value for 'disabled': 'false'. Current value: 'true'
    expect(detectChanges).not.toThrowError(/ExpressionChangedAfterItHasBeenCheckedError/);
    expect(form.valid).toBeFalse();
  });

  it('should update validity of all created nested FormGroup', () => {
    const { form, detectChanges } = renderComponent({
      fields: [
        {
          key: 'bar.foo.c1.c2.c3', // nested key + required causes bug
          templateOptions: {
            required: true,
          },
        },
      ],
    });

    detectChanges();
    expect(form.valid).toEqual(false);
  });

  it('should merge config when using provideFormlyConfig', async () => {
    TestBed.configureTestingModule({
      imports: [StandaloneAppComponent],
      providers: [
        provideFormlyCore({
          types: [{ name: 'input', component: FormlyFieldInput }],
        }),
      ],
    });

    const fixture = TestBed.createComponent(StandaloneAppComponent);
    fixture.detectChanges();
    expect(!!fixture.elementRef.nativeElement.querySelector('input')).toBeTrue();
  });
});

// reproduction for https://github.com/ngx-formly/ngx-formly/issues/4107

@Component({
  selector: 'formly-app-child',
  template: `
    <form [formGroup]="form">
      <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
  `,
  providers: [provideFormlyConfig([{ validationMessages: [{ name: 'required', message: 'Required' }] }])],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormlyModule],
})
export class StandaloneChildComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [{ type: 'input' }];
}

@Component({
  selector: 'formly-app-root',
  template: `<formly-app-child />`,
  imports: [StandaloneChildComponent],
  standalone: true,
})
export class StandaloneAppComponent {}

@Component({
  selector: 'formly-signal-model-host',
  template: `
    <p>{{ title() }}</p>
    <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormlyModule],
})
export class SignalModelHostComponent {
  form = new FormGroup({});
  model = signal({ name: 'Consultants', address: { city: 'Leeds' } });
  title = computed(() => `${this.model().name} (${this.model().address.city})`);
  fields: FormlyFieldConfig[] = [
    { key: 'name', type: 'input' },
    { key: 'address', fieldGroup: [{ key: 'city', type: 'input' }] },
  ];
}

@Component({
  selector: 'formly-type-input',
  template: ` <input type="text" [formControl]="formControl" [formlyAttributes]="field" /> `,
  standalone: true,
  imports: [FormlyAttributes, ReactiveFormsModule],
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig> {}
