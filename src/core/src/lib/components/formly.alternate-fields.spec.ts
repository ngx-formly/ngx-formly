import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { createComponent, FormlyInputModule, ɵCustomEvent } from '@ngx-formly/core/testing';
import { Subject } from 'rxjs';

function renderAlternatives(
  fields: FormlyFieldConfig[],
  model: any = { value: 'initial' },
  lazyRender = true,
  zoneless = false,
) {
  const options: FormlyFormOptions = { formState: { alternate: false } };
  return createComponent({
    template: '<formly-form [fields]="fields" [model]="model" [form]="form" [options]="options" />',
    inputs: { fields, model, form: new FormGroup({}), options },
    imports: [FormlyInputModule],
    providers: zoneless ? [provideZonelessChangeDetection()] : [],
    config: { extras: { lazyRender } },
  });
}

function alternative(alternate: boolean, config: Partial<FormlyFieldConfig> = {}): FormlyFieldConfig {
  return {
    key: 'value',
    type: 'input',
    shareFormControl: false,
    resetOnHide: false,
    expressions: { hide: ({ options }) => options.formState.alternate !== alternate },
    ...config,
  };
}

describe('alternate fields with independent controls', () => {
  it('switches rendered editors and normalizes the model with zoneless change detection', async () => {
    const first = alternative(false, { parsers: [(value) => value?.toUpperCase()] });
    const second = alternative(true, { parsers: [(value) => value?.toLowerCase()] });
    const view = renderAlternatives([first, second], { value: 'initial' }, true, true);
    await view.fixture.whenStable();
    expect(view.model.value).toBe('INITIAL');
    expect(view.query<HTMLInputElement>('input').nativeElement.value).toBe('INITIAL');

    view.options.formState.alternate = true;
    await view.fixture.whenStable();
    expect(view.model.value).toBe('initial');
    expect(view.form.get('value')).toBe(second.formControl);
    expect(view.query<HTMLInputElement>('input').nativeElement.value).toBe('initial');

    first.formControl.setValue('hidden');
    await view.fixture.whenStable();
    expect(view.model.value).toBe('initial');
  });

  it.each([true, false])('isolates parsers and switches nested editors with lazyRender=%s', (lazyRender) => {
    const upper = vi.fn((value) => value?.toUpperCase());
    const lower = vi.fn((value) => value?.toLowerCase());
    const first = alternative(false, { key: 'address.value', parsers: [upper] });
    const second = alternative(true, { key: 'address.value', parsers: [lower] });
    const { form, model, options, detectChanges, queryAll } = renderAlternatives(
      [first, second],
      { address: { value: 'INITIAL' } },
      lazyRender,
    );

    expect(first.formControl).not.toBe(second.formControl);
    expect(form.get('address.value')).toBe(first.formControl);
    expect(second.formControl.parent).toBeNull();
    expect(lower).not.toHaveBeenCalled();

    queryAll('input')[0].triggerEventHandler('input', ɵCustomEvent({ value: 'Mixed' }));
    expect(model.address.value).toBe('MIXED');
    expect(lower).not.toHaveBeenCalled();
    upper.mockClear();

    options.formState.alternate = true;
    options.detectChanges(first.parent);
    detectChanges();
    expect(form.get('address.value')).toBe(second.formControl);
    expect(first.formControl.parent).toBeNull();
    expect(model.address.value).toBe('mixed');
    expect(upper).not.toHaveBeenCalled();

    first.formControl.setValue('STALE');
    expect(model.address.value).toBe('mixed');
    expect(upper).not.toHaveBeenCalled();
    lower.mockClear();

    options.formState.alternate = false;
    options.detectChanges(first.parent);
    detectChanges();
    expect(form.get('address.value')).toBe(first.formControl);
    expect(first.formControl.value).toBe('MIXED');
    expect(model.address.value).toBe('MIXED');
    expect(lower).not.toHaveBeenCalled();
  });

  it.each([true, false])('respects a hidden parent with lazyRender=%s', (lazyRender) => {
    const parser = vi.fn((value) => value?.toUpperCase());
    const child = alternative(false, { expressions: {}, parsers: [parser] });
    const parent: FormlyFieldConfig = {
      expressions: { hide: ({ options }) => options.formState.alternate },
      fieldGroup: [child],
    };
    const { options, model, detectChanges } = renderAlternatives([parent], { value: 'INITIAL' }, lazyRender);
    parser.mockClear();

    options.formState.alternate = true;
    options.detectChanges(parent.parent);
    detectChanges();
    child.formControl.setValue('hidden');
    expect(model.value).toBe('INITIAL');
    expect(parser).not.toHaveBeenCalled();

    options.formState.alternate = false;
    options.detectChanges(parent.parent);
    detectChanges();
    expect(child.formControl.value).toBe('INITIAL');
  });

  it('cancels a debounced write even when its editor is shown again before the delay expires', async () => {
    vi.useFakeTimers();
    const first = alternative(false, { modelOptions: { debounce: { default: 50 } } });
    const second = alternative(true);
    const { model, options, detectChanges } = renderAlternatives([first, second]);
    first.formControl.setValue('pending');

    options.formState.alternate = true;
    options.detectChanges(first.parent);
    detectChanges();
    second.formControl.setValue('current');
    options.formState.alternate = false;
    options.detectChanges(first.parent);
    detectChanges();
    await vi.advanceTimersByTimeAsync(60);

    expect(model.value).toBe('current');
    expect(first.formControl.value).toBe('current');
  });

  it('keeps sync and pending async validation local to the active control', () => {
    const result = new Subject<boolean>();
    const first = alternative(false, {
      props: { required: true },
      asyncValidators: { remote: () => result },
    });
    const second = alternative(true);
    const { form, options } = renderAlternatives([first, second], {});
    expect(form.invalid).toBe(true);
    first.formControl.setValue('pending');
    expect(form.pending).toBe(true);

    options.formState.alternate = true;
    options.detectChanges(first.parent);
    expect(form.valid).toBe(true);
    expect(first.formControl.parent).toBeNull();
    result.next(false);
    result.complete();
    expect(form.valid).toBe(true);

    options.formState.alternate = false;
    options.detectChanges(first.parent);
    first.formControl.setValue('');
    expect(form.invalid).toBe(true);
    expect(first.formControl.hasError('required')).toBe(true);
  });

  it('cancels pending writes while an editor remains hidden', async () => {
    vi.useFakeTimers();
    const first = alternative(false, { modelOptions: { debounce: { default: 50 } } });
    const second = alternative(true);
    const { model, options } = renderAlternatives([first, second]);
    first.formControl.setValue('pending');
    options.formState.alternate = true;
    options.detectChanges(first.parent);
    second.formControl.setValue('current');
    await vi.advanceTimersByTimeAsync(60);
    expect(model.value).toBe('current');
  });

  it('cancels a debounced edit when the user returns to the current model value', async () => {
    vi.useFakeTimers();
    const first = alternative(false, { modelOptions: { debounce: { default: 50 } } });
    const { model } = renderAlternatives([first]);
    first.formControl.setValue('pending');
    first.formControl.setValue('initial');
    await vi.advanceTimersByTimeAsync(60);
    expect(model.value).toBe('initial');
  });

  it('disposes pending writes when the form is destroyed', async () => {
    vi.useFakeTimers();
    const first = alternative(false, { modelOptions: { debounce: { default: 50 } } });
    const { model, fixture } = renderAlternatives([first]);
    first.formControl.setValue('pending');
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(60);
    expect(model.value).toBe('initial');
  });

  it('preserves resetOnHide clearing and the next editor default', () => {
    const first = alternative(false, { resetOnHide: true, defaultValue: 'first' });
    const second = alternative(true, { resetOnHide: true, defaultValue: 'second' });
    const { model, options } = renderAlternatives([first, second], {});
    expect(model.value).toBe('first');
    first.formControl.setValue('edited');

    options.formState.alternate = true;
    options.detectChanges(first.parent);
    expect(model.value).toBe('second');
    expect(second.formControl.value).toBe('second');

    options.formState.alternate = false;
    options.detectChanges(first.parent);
    expect(model.value).toBe('first');
  });

  it('normalizes only the active editor when replacing or resetting the model', () => {
    const upper = vi.fn((value) => value?.toUpperCase());
    const lower = vi.fn((value) => value?.toLowerCase());
    const first = alternative(false, {
      parsers: [upper],
      expressions: { hide: ({ model }) => model.alternate === true },
    });
    const second = alternative(true, {
      parsers: [lower],
      expressions: { hide: ({ model }) => model.alternate !== true },
    });
    const view = renderAlternatives([first, second], { value: 'initial' });
    expect(view.model.value).toBe('INITIAL');
    expect(lower).not.toHaveBeenCalled();
    upper.mockClear();

    view.setInputs({ model: { alternate: true, value: 'Replacement' } });
    expect(view.model.value).toBe('replacement');
    expect(view.form.get('value')).toBe(second.formControl);
    expect(upper).not.toHaveBeenCalled();
    lower.mockClear();

    view.options.resetModel({ value: 'Reset' });
    expect(view.model.value).toBe('RESET');
    expect(view.form.get('value')).toBe(first.formControl);
    expect(lower).not.toHaveBeenCalled();
    expect(first.formControl.pristine).toBe(true);
  });

  it('preserves a supplied independent control', () => {
    const control = new FormControl('initial');
    const first = alternative(false, { formControl: control });
    const second = alternative(true);
    const { form } = renderAlternatives([first, second]);
    expect(first.formControl).toBe(control);
    expect(form.get('value')).toBe(control);
  });
});
