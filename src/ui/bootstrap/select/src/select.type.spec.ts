import { signal } from '@angular/core';
import { FormlyFormOptionsCache } from 'src/core/src/lib/models';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { FormlyBootstrapSelectModule } from '@ngx-formly/bootstrap/select';
import { createComponent, createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyBootstrapSelectModule],
  });
};

describe('ui-bootstrap: Select Type', () => {
  it.each(['object', 'signal'])('should remap options when the host replaces its %s model', (source) => {
    const model = signal({ label: 'Before' });
    const options = [{ value: 1 }];
    const field: FormlyFieldConfig = {
      key: 'item',
      type: 'select',
      props: { labelProp: () => field.model.label },
      expressions: { 'props.options': () => options },
    };
    const host = createComponent({
      template: '<formly-form [fields]="fields" [model]="model"></formly-form>',
      inputs: { fields: [field], model: source === 'signal' ? model : model() },
      imports: [FormlyBootstrapSelectModule],
    });
    const label = () => host.query<HTMLOptionElement>('option').nativeElement.text.trim();
    expect(label()).toBe('Before');

    if (source === 'signal') {
      model.set({ label: 'After' });
      host.detectChanges();
    } else {
      host.setInputs({ model: { label: 'After' } });
    }
    expect(label()).toBe('After');
    host.fixture.destroy();
    expect((field.options as FormlyFormOptionsCache)._afterBuild.size).toBe(0);
  });

  describe.each(['function', 'signal'])('%s option expressions', (source) => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    it.each([
      ['number', 1],
      ['bigint', BigInt(1)],
      ['circular', circular],
    ])('should refresh mutated options with %s values on rebuild', (_name, value) => {
      const options = [{ label: 'First', value }];
      const { field, queryAll, detectChanges } = renderComponent({
        key: 'item',
        type: 'select',
        expressions: { 'props.options': source === 'signal' ? signal(options) : () => options },
      });
      const labels = () => queryAll<HTMLOptionElement>('option').map(({ nativeElement }) => nativeElement.text.trim());
      expect(labels()).toEqual(['First']);

      options.push({ label: 'Second', value });
      field.options.build();
      detectChanges();
      expect(labels()).toEqual(['First', 'Second']);

      options[0].label = 'Updated';
      field.options.build();
      detectChanges();
      expect(labels()).toEqual(['Updated', 'Second']);

      options.pop();
      field.options.build();
      detectChanges();
      expect(labels()).toEqual(['Updated']);
    });

    it('should refresh contextual labels and disabled states without changing the selection', () => {
      const options = [{ value: 1 }, { value: 2 }];
      let label = 'Before';
      let disabled = false;
      const { field, query, queryAll, detectChanges } = renderComponent({
        key: 'item',
        type: 'select',
        defaultValue: 2,
        props: { labelProp: (option) => `${label} ${option.value}`, disabledProp: () => disabled },
        expressions: { 'props.options': source === 'signal' ? signal(options) : () => options },
      });
      const events = vi.fn();
      const subscription = field.options.fieldChanges.subscribe(events);
      const labels = () => queryAll<HTMLOptionElement>('option').map(({ nativeElement }) => nativeElement.text.trim());
      expect(labels()).toEqual(['Before 1', 'Before 2']);

      label = 'After';
      disabled = true;
      field.options.build();
      detectChanges();

      expect(labels()).toEqual(['After 1', 'After 2']);
      const select = query<HTMLSelectElement>('select').nativeElement;
      expect([...select.options].every((option) => option.disabled)).toBe(true);
      expect(select.selectedIndex).toBe(1);
      expect(field.formControl.value).toBe(2);
      expect(events.mock.calls.filter(([event]) => event.type === 'expressionChanges')).toEqual([]);
      subscription.unsubscribe();
    });
  });

  it('should render select type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('option')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query, queryAll } = renderComponent({
      key: 'name',
      type: 'enum',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-form-field')).not.toBeNull();
    expect(queryAll('option')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const { query, field } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        options: [{ value: 1, label: 'label 1' }],
      },
    });
    query('select').triggerEventHandler('change', ɵCustomEvent({ value: '0: 1' }));
    expect(field.formControl.value).toEqual(1);
  });

  it('should select placeholder option when value is undefined', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        placeholder: 'Placeholder option',
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
        ],
      },
    });

    const { options, selectedIndex } = query<HTMLSelectElement>('select').nativeElement;
    expect(options[selectedIndex]).toBeDefined();
    expect(options[selectedIndex].text).toEqual('Placeholder option');
  });

  it.each([false, true])('should bind grouped options with multiple=%s', (multiple) => {
    const { query, field } = renderComponent({
      key: 'sportId',
      type: 'select',
      defaultValue: multiple ? [2] : 2,
      props: {
        multiple,
        options: [
          { label: 'Soccer', value: 1, group: 'Sports' },
          { label: 'Basketball', value: 2, group: 'Sports' },
          { label: 'Unavailable', value: 3, group: 'Sports', disabled: true },
        ],
      },
    });
    const select = query<HTMLSelectElement>('select').nativeElement;

    expect(query('optgroup').attributes.label).toBe('Sports');
    expect(select.options[1].selected).toBe(true);
    expect(select.options[2].disabled).toBe(true);

    select.options[1].selected = false;
    select.options[0].selected = true;
    select.dispatchEvent(new Event('change'));
    expect(field.formControl.value).toEqual(multiple ? [1] : 1);
  });

  it(`should call change callback after formControl update`, () => {
    const changeFnSpy = vi.fn();
    const { query, field } = renderComponent({
      key: 'sportId',
      type: 'select',
      props: {
        placeholder: 'sport',
        change: (f) => changeFnSpy(f.formControl.value),
        options: [{ value: '1', label: 'Soccer' }],
      },
    });

    expect(field.formControl.value).toEqual(undefined);

    const select = query('select').nativeElement as HTMLSelectElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));

    expect(changeFnSpy).toHaveBeenCalledWith('1');
    expect(field.formControl.value).toEqual('1');
  });

  describe('render select options', () => {
    it('should correctly bind to a static array of data', () => {
      const { queryAll } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          options: [
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      expect(queryAll('select option')).toHaveLength(3);
    });

    it('should correctly bind to an Observable', () => {
      const { queryAll } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          options: of([
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ]),
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      expect(queryAll('select option')).toHaveLength(3);
    });

    it('should set aria-invalid on select to true on invalid', () => {
      const { query } = renderComponent({
        key: 'name',
        type: 'select',
        validation: { show: true },
        props: { required: true },
      });

      expect(query('select').nativeElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-invalid on enum to true on invalid', () => {
      const { query } = renderComponent({
        key: 'name',
        type: 'enum',
        validation: { show: true },
        props: { required: true },
      });

      expect(query('select').nativeElement.getAttribute('aria-invalid')).toBe('true');
    });
  });
});
