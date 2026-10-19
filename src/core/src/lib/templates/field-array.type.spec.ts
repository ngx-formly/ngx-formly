import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyInputModule, createFieldChangesSpy, createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { renderComponent as renderFormComponent } from '../components/formly.form.spec';
import { FieldArrayType } from './field-array.type';
import { BehaviorSubject } from 'rxjs';

const renderComponent = (field: FormlyFieldConfig, config = {}) => {
  return createFieldComponent(field, {
    imports: [FormlyInputModule, CommonModule],
    declarations: [ArrayTypeComponent],
    config: {
      types: [
        {
          name: 'array',
          component: ArrayTypeComponent,
        },
      ],
      ...config,
    },
  });
};

describe('Array Field Type', () => {
  it.each([false, true])('should keep a fixed-path editor bound after insertion (editor first: %s)', (editorFirst) => {
    const rows: FormlyFieldConfig = {
      key: 'rows',
      type: 'array',
      fieldArray: { fieldGroup: [{ key: 'name', type: 'input' }] },
    };
    const editor: FormlyFieldConfig = { key: 'rows.0.name', type: 'input' };
    const { field, query, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A' }] },
      fieldGroup: editorFirst ? [editor, rows] : [rows, editor],
    });
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
    const originalControl = rows.formControl.get('0.name');

    arrayType.add(0, { name: 'New' });
    detectChanges();
    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Edited' }));

    expect(field.model).toEqual({ rows: [{ name: 'Edited' }, { name: 'A' }] });
    expect(editor.formControl).toBe(rows.formControl.get('0.name'));
    expect(rows.formControl.get('1.name')).toBe(originalControl);

    originalControl.setValue('Moved');
    expect(field.model).toEqual({ rows: [{ name: 'Edited' }, { name: 'Moved' }] });

    arrayType.remove(0);
    detectChanges();
    editor.formControl.setValue('After removal');
    expect(field.model).toEqual({ rows: [{ name: 'After removal' }] });
    expect(editor.formControl).toBe(originalControl);
  });

  it('should rebind a fixed-path group and keep its validation and disabled state at that path', () => {
    const { field, query, detectChanges } = renderComponent({
      model: { rows: [{ name: 'Saved' }] },
      fieldGroup: [
        { key: 'rows', type: 'array', fieldArray: { fieldGroup: [{ key: 'name', type: 'input' }] } },
        { key: 'rows.0', fieldGroup: [{ key: 'name', type: 'input', props: { minLength: 3 } }] },
      ],
    });
    const [rows, group] = field.fieldGroup;
    const editor = group.fieldGroup[0];
    const movedControl = editor.formControl;
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

    arrayType.add(0, { name: 'N' });
    detectChanges();
    expect(group.formControl).toBe(rows.formControl.get('0'));
    expect(editor.formControl).toBe(rows.formControl.get('0.name'));
    expect(editor.formControl.invalid).toBe(true);
    movedControl.setValue('A');
    expect(movedControl.valid).toBe(true);
    expect(field.model).toEqual({ rows: [{ name: 'N' }, { name: 'A' }] });

    movedControl.disable();
    expect(editor.props.disabled).toBe(false);
    editor.formControl.disable();
    expect(editor.props.disabled).toBe(true);
    editor.props.disabled = false;
    expect(editor.formControl.enabled).toBe(true);
    expect(movedControl.disabled).toBe(true);
  });

  it('should rebind every child of a fixed-path group before hidden rows are shown', () => {
    let hideRows = false;
    const { field, query, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      fieldGroup: [
        {
          key: 'rows',
          type: 'array',
          fieldArray: {
            resetOnHide: false,
            expressions: { hide: () => hideRows },
            fieldGroup: [{ key: 'name', type: 'input', resetOnHide: false }],
          },
        },
        { key: 'rows.2', fieldGroup: [{ key: 'name', type: 'input', resetOnHide: false }] },
      ],
    });
    const [rows, group] = field.fieldGroup;
    const editor = group.fieldGroup[0];
    const movedControl = rows.fieldGroup[1].fieldGroup[0].formControl;
    hideRows = true;
    field.options.detectChanges(field);
    detectChanges();
    (query('formly-array').componentInstance as ArrayTypeComponent).add(0, { name: 'New' });
    detectChanges();
    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Edited' }));
    expect(field.model.rows).toEqual([{ name: 'New' }, { name: 'A' }, { name: 'Edited' }, { name: 'C' }]);

    hideRows = false;
    field.options.detectChanges(field);
    detectChanges();
    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Again' }));
    expect(field.model.rows).toEqual([{ name: 'New' }, { name: 'A' }, { name: 'Again' }, { name: 'C' }]);
    expect(rows.formControl.value).toEqual(field.model.rows);
    expect(editor.formControl).toBe(movedControl);
    expect(group.formControl).toBe(rows.fieldGroup[2].formControl);
  });

  it.each(['add', 'remove'])('should keep a fixed-path editor bound when rows are hidden during %s', (operation) => {
    let hideRows = false;
    const { field, query, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A' }, { name: 'B' }] },
      fieldGroup: [
        {
          key: 'rows',
          type: 'array',
          fieldArray: {
            resetOnHide: false,
            expressions: { hide: () => hideRows },
            fieldGroup: [{ key: 'name', type: 'input', resetOnHide: false }],
          },
        },
        { key: 'rows.0.name', type: 'input', resetOnHide: false },
      ],
    });
    const [rows, editor] = field.fieldGroup;
    const originalControls = rows.fieldGroup.map((row) => row.formControl);
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

    hideRows = true;
    field.options.detectChanges(field);
    detectChanges();
    expect(field.model).toEqual({ rows: [{ name: 'A' }, { name: 'B' }] });

    if (operation === 'add') {
      arrayType.add(0, { name: 'New' });
    } else {
      arrayType.remove(0);
    }
    detectChanges();
    hideRows = false;
    field.options.detectChanges(field);
    detectChanges();
    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Edited' }));

    expect(field.model).toEqual({
      rows: operation === 'add' ? [{ name: 'Edited' }, { name: 'A' }, { name: 'B' }] : [{ name: 'Edited' }],
    });
    expect(editor.formControl).toBe(rows.formControl.get('0.name'));
    expect(rows.formControl.get(operation === 'add' ? '2' : '0')).toBe(originalControls[1]);
  });

  it('should rebind a fixed-path validation message after insertion and removal', () => {
    const { field, query, detectChanges } = createFieldComponent(
      {
        model: { rows: [{ name: 'Saved' }] },
        fieldGroup: [
          { key: 'rows', type: 'array', fieldArray: { fieldGroup: [{ key: 'name', type: 'input' }] } },
          {
            key: 'rows.0.name',
            type: 'input',
            props: { minLength: 3 },
            validation: { messages: { minLength: 'Too short' } },
          },
        ],
      },
      {
        template: `
          <formly-field [field]="field"></formly-field>
          <formly-validation-message [field]="field.fieldGroup[1]"></formly-validation-message>
        `,
        imports: [FormlyInputModule, CommonModule],
        declarations: [ArrayTypeComponent],
        config: { types: [{ name: 'array', component: ArrayTypeComponent }] },
      },
    );
    const editor = field.fieldGroup[1];
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
    const content = () => query('formly-validation-message').nativeElement.textContent;

    arrayType.add(0, { name: 'New' });
    detectChanges();
    editor.formControl.setValue('N');
    detectChanges();
    expect(editor.formControl.invalid).toBe(true);
    expect(content()).toBe('Too short');

    arrayType.remove(0);
    detectChanges();
    expect(content()).toBe('');
    editor.formControl.setValue('S');
    detectChanges();
    expect(content()).toBe('Too short');
  });

  it('should bind a fixed-path editor to a hidden row when other rows remain visible', () => {
    let hideRow = false;
    const { field, query, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A' }, { name: 'B' }] },
      fieldGroup: [
        {
          key: 'rows',
          type: 'array',
          fieldArray: {
            resetOnHide: false,
            expressions: { hide: (f) => hideRow && f.model.name === 'A' },
            fieldGroup: [{ key: 'name', type: 'input', resetOnHide: false }],
          },
        },
        { key: 'rows.1.name', type: 'input', resetOnHide: false },
      ],
    });
    const [rows, editor] = field.fieldGroup;
    const originalControl = rows.formControl.get('0.name');
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

    hideRow = true;
    field.options.detectChanges(field);
    detectChanges();
    arrayType.add(0, { name: 'New' });
    detectChanges();
    expect(editor.formControl === originalControl).toBe(true);

    editor.formControl.setValue('Edited');
    hideRow = false;
    field.options.detectChanges(field);
    detectChanges();
    expect(field.model).toEqual({ rows: [{ name: 'New' }, { name: 'Edited' }, { name: 'B' }] });
    expect(rows.formControl.value).toEqual(field.model.rows);
  });

  it.each([0, 1])('should rebind a hidden row editor across connected arrays (source: %s)', (source) => {
    let hideRow = false;
    const arrays: FormlyFieldConfig[] = ['other', 'name'].map((key) => ({
      key: 'rows',
      type: 'array',
      fieldArray: {
        resetOnHide: false,
        expressions: { hide: (f) => hideRow && f.model.name === 'A' },
        fieldGroup: [{ key, type: 'input', resetOnHide: false }],
      },
    }));
    const editor: FormlyFieldConfig = { key: 'rows.1.name', type: 'input', resetOnHide: false };
    const { field, query, queryAll, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      fieldGroup: [...arrays, editor],
    });
    const originalControl = arrays[1].fieldGroup[0].fieldGroup[0].formControl;

    hideRow = true;
    field.options.detectChanges(field);
    detectChanges();
    (queryAll('formly-array')[source].componentInstance as ArrayTypeComponent).add(0, { name: 'New' });
    detectChanges();
    expect(field.model.rows).toEqual([{ name: 'New' }, { name: 'A' }, { name: 'B' }, { name: 'C' }]);
    expect(editor.formControl).toBe(originalControl);

    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Edited' }));
    hideRow = false;
    field.options.detectChanges(field);
    detectChanges();
    expect(field.model.rows).toEqual([{ name: 'New' }, { name: 'Edited' }, { name: 'B' }, { name: 'C' }]);
    expect(arrays[0].formControl.value).toEqual(field.model.rows);
    expect(editor.formControl).toBe(arrays[1].fieldGroup[1].fieldGroup[0].formControl);
  });

  it.each([0, 1])('should share newly inserted hidden row controls across connected arrays (source: %s)', (source) => {
    let hideRows = false;
    const arrays: FormlyFieldConfig[] = ['other', 'name'].map((key) => ({
      key: 'rows',
      type: 'array',
      fieldArray: {
        resetOnHide: false,
        expressions: { hide: () => hideRows },
        fieldGroup: [{ key, type: 'input', resetOnHide: false, props: { required: true } }],
      },
    }));
    const { field, query, queryAll, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A', other: 'X' }] },
      fieldGroup: [...arrays, { key: 'rows.0.name', type: 'input', resetOnHide: false }],
    });

    hideRows = true;
    field.options.detectChanges(field);
    detectChanges();
    (queryAll('formly-array')[source].componentInstance as ArrayTypeComponent).add(0, { name: 'New', other: 'Y' });
    detectChanges();
    hideRows = false;
    field.options.detectChanges(field);
    detectChanges();

    expect(arrays[0].fieldGroup[0].formControl).toBe(arrays[1].fieldGroup[0].formControl);
    expect(arrays[0].formControl.value).toEqual([
      { name: 'New', other: 'Y' },
      { name: 'A', other: 'X' },
    ]);
    const other = arrays[0].fieldGroup[0].fieldGroup[0];
    query(`[id="${other.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: '' }));
    expect(field.model.rows[0]).toEqual({ name: 'New', other: '' });
    expect(field.formControl.valid).toBe(false);
  });

  it('should exclude hidden parent positions from array values and validation', () => {
    let hideRows = false;
    let visibleName: string;
    const { field, query, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      fieldGroup: [
        {
          key: 'rows',
          type: 'array',
          props: { required: true },
          validators: { noEmptyRow: { expression: (c) => c.value.every((row) => !!row.name) } },
          fieldArray: {
            resetOnHide: false,
            expressions: { hide: (f) => hideRows && f.model.name !== visibleName },
            validators: { hiddenRow: { expression: () => false } },
            fieldGroup: [{ key: 'name', type: 'input', resetOnHide: false }],
          },
        },
        { key: 'rows.2.name', type: 'input', resetOnHide: false },
      ],
    });
    const [rows, editor] = field.fieldGroup;
    const array = query('formly-array').componentInstance as ArrayTypeComponent;
    hideRows = true;
    field.options.detectChanges(field);
    detectChanges();
    array.add(0, { name: 'New' });
    detectChanges();

    expect(rows.formControl.valid).toBe(true);
    expect(rows.formControl.value).toEqual([{ name: 'B' }]);
    visibleName = 'A';
    field.options.detectChanges(field);
    detectChanges();
    expect(rows.formControl.value).toEqual([{ name: 'A' }, { name: 'B' }]);
    visibleName = undefined;
    field.options.detectChanges(field);
    detectChanges();
    expect(rows.formControl.value).toEqual([{ name: 'B' }]);
    editor.hide = true;
    field.options.detectChanges(field);
    detectChanges();
    expect(rows.formControl.value).toEqual([]);
    expect(rows.formControl.errors).toEqual({ required: true });
    expect(field.model.rows).toEqual([{ name: 'New' }, { name: 'A' }, { name: 'B' }, { name: 'C' }]);

    array.add(0, { name: 'Next' });
    detectChanges();
    expect(rows.formControl.value).toEqual([]);
    expect(rows.formControl.errors).toEqual({ required: true });
    editor.hide = false;
    field.options.detectChanges(field);
    detectChanges();
    expect(rows.formControl.value).toEqual([{ name: 'A' }]);
    expect(rows.formControl.valid).toBe(true);

    hideRows = false;
    field.options.detectChanges(field);
    detectChanges();
    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Edited' }));
    expect(field.model.rows).toEqual([
      { name: 'Next' },
      { name: 'New' },
      { name: 'Edited' },
      { name: 'B' },
      { name: 'C' },
    ]);
    expect(rows.formControl.value).toEqual(field.model.rows);
    expect(rows.formControl.valid).toBe(false);
  });

  it.each([false, true])('should rebind an editor at a later hidden position (connected: %s)', (connected) => {
    let hideRows = false;
    const arrays: FormlyFieldConfig[] = (connected ? ['other', 'name'] : ['name']).map((key) => ({
      key: 'rows',
      type: 'array',
      fieldArray: {
        resetOnHide: false,
        expressions: { hide: () => hideRows },
        validators: { row: { expression: (_control, f) => f.model.name !== 'A' } },
        fieldGroup: [{ key, type: 'input', resetOnHide: false }],
      },
    }));
    const editor: FormlyFieldConfig = { key: 'rows.2.name', type: 'input', resetOnHide: false };
    const { field, query, detectChanges } = renderComponent({
      model: { rows: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      fieldGroup: [...arrays, editor],
    });
    const rows = arrays[arrays.length - 1];
    const originalControls = rows.fieldGroup.map((row) => row.fieldGroup[0].formControl);
    const array = query('formly-array').componentInstance as ArrayTypeComponent;
    expect(field.formControl.valid).toBe(false);

    hideRows = true;
    field.options.detectChanges(field);
    detectChanges();
    array.add(0, { name: 'New' });
    detectChanges();
    expect(field.model.rows).toEqual([{ name: 'New' }, { name: 'A' }, { name: 'B' }, { name: 'C' }]);
    expect(editor.formControl).toBe(originalControls[1]);
    expect(field.formControl.valid).toBe(true);
    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Edited' }));
    expect(field.model.rows).toEqual([{ name: 'New' }, { name: 'A' }, { name: 'Edited' }, { name: 'C' }]);

    array.remove(0);
    detectChanges();
    expect(editor.formControl).toBe(originalControls[2]);
    expect(field.formControl.valid).toBe(true);
    expect(query<HTMLInputElement>(`[id="${editor.id}"]`).nativeElement.value).toBe('C');
    query(`[id="${editor.id}"]`).triggerEventHandler('input', ɵCustomEvent({ value: 'Again' }));
    hideRows = false;
    field.options.detectChanges(field);
    detectChanges();
    expect(field.model.rows).toEqual([{ name: 'A' }, { name: 'Edited' }, { name: 'Again' }]);
    expect(rows.formControl.value).toEqual(field.model.rows);
    rows.fieldGroup.forEach((row, index) => expect(row.fieldGroup[0].formControl).toBe(originalControls[index]));
    expect(field.formControl.valid).toBe(false);

    originalControls[2].setValue('Row edit');
    detectChanges();
    expect(query<HTMLInputElement>(`[id="${editor.id}"]`).nativeElement.value).toBe('Row edit');
  });

  it.each(['function', 'observable'])(
    'should preserve a nested array disabled %s expression when its parent is enabled',
    (source) => {
      let disabled = true;
      const disabled$ = new BehaviorSubject(true);
      const { field, query, queryAll, detectChanges } = renderComponent({
        key: 'outer',
        expressions: { 'props.disabled': () => disabled },
        fieldGroup: [
          {
            key: 'items',
            type: 'array',
            defaultValue: ['saved'],
            expressions: { 'props.disabled': source === 'observable' ? disabled$ : () => disabled$.value },
            fieldArray: { type: 'input' },
          },
          { key: 'sibling' },
        ],
      });
      const [items, sibling] = field.fieldGroup;

      for (const value of [false, true, false]) {
        disabled = value;
        field.options.detectChanges(field);
        detectChanges();
        expect(items.props.disabled).toBe(true);
        expect(items.formControl.disabled).toBe(true);
        expect(query<HTMLInputElement>('input').nativeElement.disabled).toBe(true);
        expect(sibling.formControl.disabled).toBe(value);
      }

      const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
      arrayType.add(undefined, 'new');
      detectChanges();
      expect(queryAll<HTMLInputElement>('input').every(({ nativeElement }) => nativeElement.disabled)).toBe(true);
      arrayType.remove(0);
      detectChanges();
      expect(items.model).toEqual(['new']);
      expect(items.formControl.disabled).toBe(true);
      expect(query<HTMLInputElement>('input').nativeElement.disabled).toBe(true);

      disabled$.next(false);
      field.options.detectChanges(field);
      detectChanges();
      expect(items.formControl.enabled).toBe(true);
      expect(query<HTMLInputElement>('input').nativeElement.disabled).toBe(false);
    },
  );

  it('should restore array and item defaults when resetting an unchanged visible field', () => {
    const { field, queryAll, detectChanges } = renderComponent({
      key: 'items',
      type: 'array',
      defaultValue: [{}],
      expressions: { hide: () => false },
      fieldArray: {
        fieldGroup: [{ key: 'foo', type: 'input', defaultValue: 'default', expressions: { hide: () => false } }],
      },
    });

    field.options.resetModel({});
    detectChanges();

    expect(field.model).toEqual([{ foo: 'default' }]);
    expect(field.formControl.value).toEqual([{ foo: 'default' }]);
    expect(queryAll('input')).toHaveLength(1);
  });

  it('should render fieldGroup', () => {
    const { query, queryAll } = renderComponent({
      key: 'foo',
      type: 'array',
      defaultValue: [null, null],
    });

    expect(query('formly-array')).not.toBeNull();
    expect(queryAll('formly-array > formly-field')).toHaveLength(2);
  });

  it('should ignore invalid model value', () => {
    const { queryAll } = renderComponent({
      key: 'foo',
      type: 'array',
      defaultValue: '123456',
    });

    expect(queryAll('formly-array > formly-field')).toHaveLength(0);
  });

  it('should support passing a function to fieldArray', () => {
    const { query, field } = renderComponent({
      key: 'foo',
      type: 'array',
      defaultValue: [],
      fieldArray: () => ({ fieldGroup: [{ key: 'name', defaultValue: 'foo' }] }),
    });

    expect(field.fieldGroup).toEqual([]);
    expect(field.model).toEqual([]);
    query('#add').triggerEventHandler('click', {});

    expect(field.fieldGroup).toHaveLength(1);
    expect(field.model).toEqual([{ name: 'foo' }]);
  });

  it('should support field without key', () => {
    const { field, query, detectChanges } = renderComponent({ model: [], type: 'array' });
    expect(field.model).toEqual([]);

    query('#add').triggerEventHandler('click', {});
    detectChanges();

    expect(field.model).toEqual([undefined]);

    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();

    expect(field.model).toEqual([]);
  });

  it('should work with nullable model', () => {
    const { field, query } = renderComponent({
      model: { array: null },
      key: 'array',
      type: 'array',
    });

    expect(field.fieldGroup).toEqual([]);
    expect(field.model).toBeNull();

    query('#add').triggerEventHandler('click', {});

    expect(field.fieldGroup).toHaveLength(1);
    expect(field.model).toHaveLength(1);
  });

  it('should emit `modelChange` on Add/Remove', () => {
    const { detectChanges, field, query } = renderComponent({
      key: 'array',
      type: 'array',
    });

    const [spy, subscription] = createFieldChangesSpy(field);
    const form = field.formControl as FormArray;

    // add
    query('#add').triggerEventHandler('click', {});
    detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ value: [undefined], field, type: 'valueChanges' });
    expect(field.parent.model).toEqual({ array: [undefined] });

    // update
    spy.mockReset();
    form.at(0).patchValue('***');
    detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ value: '***', field: field.fieldGroup[0], type: 'valueChanges' });
    expect(field.parent.model).toEqual({ array: ['***'] });

    // remove
    spy.mockReset();
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ value: [], field, type: 'valueChanges' });
    expect(field.parent.model).toEqual({ array: [] });

    subscription.unsubscribe();
  });

  it('should emit `valueChanges` on model change', () => {
    const { fields, setInputs, detectChanges } = renderFormComponent(
      {
        fields: [
          {
            key: 'foo',
            type: 'array',
            fieldArray: { key: 'title' },
          },
        ],
      },
      {
        config: {
          declarations: [ArrayTypeComponent],
          types: [
            {
              name: 'array',
              component: ArrayTypeComponent,
            },
          ],
        },
      },
    );
    const spy = vi.fn();
    const subscription = fields[0].formControl.valueChanges.subscribe(spy);

    // add
    setInputs({ model: { foo: [{ title: 1 }] } });
    detectChanges();

    expect(spy).toHaveBeenCalledWith([{ title: 1 }]);

    // remove
    spy.mockReset();

    setInputs({ model: { foo: [] } });

    expect(spy).toHaveBeenCalledWith([]);
    subscription.unsubscribe();
  });

  it('should not triggers valueChanges for all fields on add/remove', () => {
    const { detectChanges, field, query } = renderComponent({
      fieldGroup: [
        {
          key: 'foo',
          type: 'array',
          fieldArray: { key: 'title' },
        },
        {
          key: 'bar',
          type: 'array',
          fieldArray: { key: 'title' },
        },
      ],
    });

    const spy = vi.fn();
    const subscription = field.form.get('bar').valueChanges.subscribe(spy);

    // add
    query('#add').triggerEventHandler('click', {});
    detectChanges();

    expect(spy).not.toHaveBeenCalled();

    // remove
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();

    expect(spy).not.toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('should not triggers valueChanges in children fields on add/remove', () => {
    const { detectChanges, field, query } = renderComponent({
      fieldGroup: [
        {
          key: 'foo',
          type: 'array',
          fieldArray: { fieldGroup: [{ key: 'title' }] },
          defaultValue: [{ title: 'test' }],
        },
      ],
    });

    const form = field.form.get('foo') as FormArray;

    const spy = vi.fn();
    const subscription = form.at(0).get('title').valueChanges.subscribe(spy);

    // add
    query('#add').triggerEventHandler('click', {});
    detectChanges();

    expect(spy).not.toHaveBeenCalled();

    // remove
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();

    expect(spy).not.toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('should validate field on add/remove', () => {
    const { detectChanges, field, query } = renderComponent({
      fieldGroup: [
        {
          key: 'foo',
          type: 'array',
          fieldArray: { fieldGroup: [{ key: 'title', props: { required: true } }] },
          defaultValue: [{ title: 'test' }],
        },
      ],
    });
    const form = field.form.get('foo') as FormArray;

    expect(form.valid).toEqual(true);

    // add
    query('#add').triggerEventHandler('click', {});
    detectChanges();

    expect(form.valid).toEqual(false);

    // remove
    query('#remove-1').triggerEventHandler('click', {});
    detectChanges();

    expect(form.valid).toEqual(true);
  });

  it('should update connected fields on add/remove', () => {
    const { detectChanges, field, query } = renderComponent({
      fieldGroup: [
        {
          key: 'foo',
          type: 'array',
          fieldArray: { key: 'title' },
        },
        {
          key: 'foo',
          type: 'array',
          fieldArray: { key: 'title' },
        },
      ],
    });

    // add
    query('#add').triggerEventHandler('click', {});
    detectChanges();

    expect(field.fieldGroup[0].fieldGroup.length).toEqual(1);
    expect(field.fieldGroup[1].fieldGroup.length).toEqual(1);

    // remove
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();

    expect(field.fieldGroup[0].fieldGroup.length).toEqual(0);
    expect(field.fieldGroup[1].fieldGroup.length).toEqual(0);
  });

  it('should share formControl when field key is duplicated', () => {
    const {
      field: { fieldGroup },
    } = renderComponent({
      fieldGroup: [
        {
          key: 'foo',
          type: 'array',
          fieldArray: { key: 'firtname' },
        },
        {
          key: 'foo',
          type: 'array',
          fieldArray: { key: 'lastname' },
        },
      ],
    });

    expect(fieldGroup[0].formControl).toEqual(fieldGroup[1].formControl);
  });

  it('should not reuse the remove controls', () => {
    const { field, query, detectChanges } = renderComponent({
      key: 'array',
      type: 'array',
    });
    const form = field.formControl as FormArray;

    query('#add').triggerEventHandler('click', {});
    query('#add').triggerEventHandler('click', {});
    detectChanges();

    query('#remove-0').triggerEventHandler('click', {});
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();

    query('#add').triggerEventHandler('click', {});
    query('#add').triggerEventHandler('click', {});
    detectChanges();

    form.at(0).setValue('foo');

    expect(form.at(1)).not.toEqual(form.at(0));
    expect(form.at(1).value).toBeUndefined();
  });

  // https://github.com/ngx-formly/ngx-formly/issues/2493
  it('should add field when model is null', () => {
    const { field, query, detectChanges } = renderComponent({
      model: null,
      key: 'array',
      type: 'array',
    });

    query('#add').triggerEventHandler('click', {});
    detectChanges();

    expect(field.fieldGroup.length).toEqual(1);
    expect(field.formControl.value).toEqual([undefined]);
  });

  it('should mark the form dirty on Add/Remove', () => {
    const { field, query, detectChanges } = renderComponent({
      key: 'array',
      type: 'array',
    });

    const { formControl } = field;
    expect(formControl.dirty).toBe(false);
    query('#add').triggerEventHandler('click', {});
    detectChanges();
    expect(formControl.dirty).toBe(true);

    formControl.markAsPristine();
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();
    expect(formControl.dirty).toBe(true);
  });

  it('should not mark the form dirty on Add/Remove', () => {
    const { field, query, detectChanges } = renderComponent({
      key: 'array',
      type: 'array',
    });

    expect(field.form.dirty).toBe(false);

    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

    arrayType.add(null, null, { markAsDirty: false });
    detectChanges();
    expect(field.form.dirty).toBe(false);

    field.form.markAsPristine();

    arrayType.remove(0, { markAsDirty: false });
    detectChanges();
    expect(field.form.dirty).toBe(false);
  });

  it('should not change the form control instance when chinging the field position', () => {
    const { detectChanges, field, query } = renderComponent({
      model: { foo: [1, 2] },
      key: 'foo',
      type: 'array',
      fieldArray: { type: 'input' },
    });
    const formArray = field.formControl as FormArray;

    const formControl = formArray.at(1);
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();

    expect(formArray.controls).toHaveLength(1);
    expect(formArray.at(0)).toEqual(formControl);
  });

  it.each([0, 1])('should preserve row identity when inserting at index %s', (index) => {
    const { detectChanges, field, query, queryAll } = renderComponent({
      key: 'rows',
      type: 'array',
      defaultValue: [{ name: 'A' }, { name: 'B' }],
      fieldArray: { fieldGroup: [{ key: 'name', type: 'input' }] },
    });
    const formArray = field.formControl as FormArray;
    const originalFields = [...field.fieldGroup];
    const originalControls = [...formArray.controls];
    const originalInputs = queryAll('input').map(({ nativeElement }) => nativeElement);
    originalControls[1].get('name').markAsTouched();
    originalControls[1].get('name').markAsDirty();

    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
    arrayType.add(index, { name: 'New' });
    detectChanges();

    const expected = [{ name: 'A' }, { name: 'B' }];
    expected.splice(index, 0, { name: 'New' });
    expect(field.model).toEqual(expected);
    expect(field.fieldGroup.map(({ key }) => key)).toEqual(['0', '1', '2']);
    expect(formArray.value).toEqual(expected);
    expect(queryAll<HTMLInputElement>('input').map(({ nativeElement }) => nativeElement.value)).toEqual(
      expected.map(({ name }) => name),
    );

    originalFields.forEach((originalField, i) => {
      const shiftedIndex = i < index ? i : i + 1;
      expect(field.fieldGroup[shiftedIndex] === originalField).toBe(true);
      expect(formArray.at(shiftedIndex)).toBe(originalControls[i]);
      expect(queryAll('input')[shiftedIndex].nativeElement).toBe(originalInputs[i]);
    });
    expect(formArray.at(2).get('name').touched).toBe(true);
    expect(formArray.at(2).get('name').dirty).toBe(true);
    expect(formArray.at(index).pristine).toBe(true);
    expect(formArray.at(index).untouched).toBe(true);
    expect(formArray.dirty).toBe(true);

    originalControls[1].get('name').setValue('Updated B');
    detectChanges();
    expect(field.model[2]).toEqual({ name: 'Updated B' });
    expect(field.model[index]).toEqual({ name: 'New' });

    arrayType.remove(index);
    detectChanges();
    expect(field.model).toEqual([{ name: 'A' }, { name: 'Updated B' }]);
    expect(formArray.value).toEqual(field.model);
    originalControls.forEach((control, i) => expect(formArray.at(i)).toBe(control));
  });

  it('should preserve connected fields when inserting at an index', () => {
    const { detectChanges, field, queryAll } = renderComponent({
      model: { rows: [{ name: 'A' }, { name: 'B' }] },
      fieldGroup: [0, 1].map(() => ({
        key: 'rows',
        type: 'array',
        fieldArray: { fieldGroup: [{ key: 'name', type: 'input' }] },
      })),
    });
    const originalFields = field.fieldGroup.map((f) => [...f.fieldGroup]);
    const formArray = field.fieldGroup[0].formControl as FormArray;
    const originalControls = [...formArray.controls];
    const arrayType = queryAll('formly-array')[1].componentInstance as ArrayTypeComponent;

    arrayType.add(0, { name: 'New' });
    detectChanges();

    field.fieldGroup.forEach((f, index) => {
      expect(f.formControl).toBe(formArray);
      expect(f.fieldGroup.map(({ key }) => key)).toEqual(['0', '1', '2']);
      originalFields[index].forEach((originalField, i) => {
        expect(f.fieldGroup[i + 1] === originalField).toBe(true);
        expect(f.fieldGroup[i + 1].formControl).toBe(originalControls[i]);
      });
      expect(f.fieldGroup[0].formControl).toBe(formArray.at(0));
    });
    expect(formArray.value).toEqual([{ name: 'New' }, { name: 'A' }, { name: 'B' }]);
    expect(queryAll<HTMLInputElement>('input').map(({ nativeElement }) => nativeElement.value)).toEqual([
      'New',
      'A',
      'B',
      'New',
      'A',
      'B',
    ]);

    arrayType.remove(0);
    detectChanges();
    field.fieldGroup.forEach((f, index) => {
      originalFields[index].forEach((originalField, i) => {
        expect(f.fieldGroup[i]).toBe(originalField);
        expect(f.fieldGroup[i].formControl).toBe(originalControls[i]);
      });
    });
    expect(field.model).toEqual({ rows: [{ name: 'A' }, { name: 'B' }] });
  });

  it.each([0, 1])('should track connected arrays by index when array %s initiates a change', (source) => {
    const { field, queryAll, detectChanges } = renderComponent({
      model: { rows: ['A', 'BB'] },
      fieldGroup: [
        {
          key: 'rows',
          type: 'array',
          props: { trackByIndex: true },
          fieldArray: (f) => ({ type: 'input', props: { minLength: f.fieldGroup.length + 1 } }),
        },
        { key: 'rows', type: 'array', fieldArray: { type: 'input' } },
      ],
    });
    const originalFields = field.fieldGroup.map((f) => [...f.fieldGroup]);
    const formArray = field.fieldGroup[0].formControl as FormArray;
    const originalControls = [...formArray.controls];
    const originalInputs = queryAll('input').map(({ nativeElement }) => nativeElement);
    const arrayType = queryAll('formly-array')[source].componentInstance as ArrayTypeComponent;
    originalControls[1].markAsTouched();
    originalControls[1].markAsDirty();

    arrayType.add(0, 'New');
    detectChanges();

    expect(field.model).toEqual({ rows: ['New', 'A', 'BB'] });
    expect(formArray.value).toEqual(['New', 'A', 'BB']);
    expect(formArray.invalid).toBe(true);
    expect(field.fieldGroup[0].fieldGroup.map((f) => f.props.minLength)).toEqual([1, 2, 3]);
    field.fieldGroup.forEach((f, index) => {
      originalFields[index].forEach((originalField, i) => {
        expect(f.fieldGroup[i]).toBe(originalField);
        expect(f.fieldGroup[i].formControl).toBe(originalControls[i]);
        expect(queryAll('input')[index * 3 + i].nativeElement).toBe(originalInputs[index * 2 + i]);
      });
    });
    expect(formArray.at(1).touched).toBe(true);
    expect(formArray.at(1).dirty).toBe(true);
    expect(formArray.at(2).untouched).toBe(true);
    expect(formArray.at(2).pristine).toBe(true);

    arrayType.remove(0);
    detectChanges();

    expect(field.model).toEqual({ rows: ['A', 'BB'] });
    expect(formArray.value).toEqual(['A', 'BB']);
    expect(formArray.valid).toBe(true);
    expect(field.fieldGroup[0].fieldGroup.map((f) => f.props.minLength)).toEqual([1, 2]);
    field.fieldGroup.forEach((f, index) => {
      originalFields[index].forEach((originalField, i) => {
        expect(f.fieldGroup[i]).toBe(originalField);
        expect(f.fieldGroup[i].formControl).toBe(originalControls[i]);
      });
    });
  });

  it('should insert a keyless fieldArray with defaults without marking the form dirty', () => {
    const { detectChanges, field, query } = renderComponent({
      key: 'rows',
      type: 'array',
      defaultValue: [{ name: 'A' }],
      fieldArray: (f) => ({
        key: null,
        fieldGroup: [
          { key: `${f.fieldGroup.length}`, fieldGroup: [{ key: 'name', type: 'input', defaultValue: 'New' }] },
        ],
      }),
    });
    const formArray = field.formControl as FormArray;
    const originalControl = formArray.at(0);
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
    const [spy, subscription] = createFieldChangesSpy(field);

    arrayType.add(0, undefined, { markAsDirty: false });
    detectChanges();

    expect(field.model).toEqual([{ name: 'New' }, { name: 'A' }]);
    expect(formArray.value).toEqual(field.model);
    expect(formArray.at(1)).toBe(originalControl);
    expect(field.fieldGroup.map((f) => f.fieldGroup[0].key)).toEqual(['0', '1']);
    expect(field.form.pristine).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ value: field.model, field, type: 'valueChanges' });
    subscription.unsubscribe();

    arrayType.remove(0);
    detectChanges();
    expect(field.model).toEqual([{ name: 'A' }]);
    expect(formArray.value).toEqual(field.model);
    expect(formArray.at(0)).toBe(originalControl);
  });

  it('should preserve controls when inserting into an array field without a key', () => {
    const { detectChanges, field, query } = renderComponent({
      model: ['A', 'B'],
      type: 'array',
      fieldArray: { type: 'input' },
    });
    const originalControl = field.formControl.get('0');
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

    arrayType.add(0, 'New');
    detectChanges();

    expect(field.model).toEqual(['New', 'A', 'B']);
    expect(field.formControl.value).toEqual({ 0: 'New', 1: 'A', 2: 'B' });
    expect(field.formControl.get('1')).toBe(originalControl);
  });

  it.each([
    [undefined, ['A', 'B', 'New']],
    [0, ['New', 'A', 'B']],
  ])(
    'should not change the parent group when inserting into a keyless array at index %s',
    (index: number, expected: string[]) => {
      const { detectChanges, field, query, queryAll } = renderComponent({
        model: { rows: ['A', 'B'] },
        fieldGroup: [{ key: 'rows', fieldGroup: [{ type: 'array', fieldArray: { type: 'input' } }] }],
      });
      const [group] = field.fieldGroup;
      const [arrayField] = group.fieldGroup;
      const originalControls = ['0', '1'].map((key) => group.formControl.get(key));
      const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

      arrayType.add(index, 'New');
      detectChanges();

      expect(field.model).toEqual({ rows: expected });
      expect(group.formControl.value).toEqual({ ...expected });
      expect(group.fieldGroup).toHaveLength(1);
      expect(group.fieldGroup[0] === arrayField).toBe(true);
      expect(arrayField.fieldGroup.map(({ key }) => key)).toEqual(['0', '1', '2']);
      expect(queryAll<HTMLInputElement>('input').map(({ nativeElement }) => nativeElement.value)).toEqual(expected);
      originalControls.forEach((control, i) => {
        expect(group.formControl.get(`${expected.indexOf(['A', 'B'][i])}`)).toBe(control);
      });
    },
  );

  it.each([
    [-1, ['A', 'New', 'B']],
    [-10, ['New', 'A', 'B']],
    [10, ['A', 'B', 'New']],
  ])('should follow splice semantics when inserting at index %s', (index: number, expected: string[]) => {
    const { field, query, detectChanges } = renderComponent({
      key: 'rows',
      type: 'array',
      defaultValue: ['A', 'B'],
      fieldArray: { type: 'input' },
    });
    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

    arrayType.add(index, 'New');
    detectChanges();

    expect(field.model).toEqual(expected);
    expect(field.formControl.value).toEqual(expected);
    expect(field.fieldGroup.map(({ key }) => key)).toEqual(['0', '1', '2']);
  });

  it('should apply expressions within field arrays', () => {
    const { detectChanges, field } = renderComponent({
      key: 'address',
      type: 'array',
      defaultValue: ['test'],
      fieldArray: {
        type: 'input',
        expressions: {
          hide: 'model[0] === "test"',
          className: 'model[0]',
        },
      },
    });

    const {
      fieldGroup: [cityField],
      model,
      options,
    } = field;
    expect(cityField.hide).toBe(true);
    expect(cityField.className).toEqual('test');

    model[0] = 'custom';
    options.checkExpressions(cityField);
    detectChanges();

    expect(cityField.hide).toBe(false);
    expect(cityField.className).toEqual('custom');
  });

  it('should cleanup existing controls on re-build', () => {
    const { field } = renderComponent({
      key: 'address',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
    });
    const { model, options, formControl } = field;
    const form = formControl as FormArray;

    expect(form.controls).toHaveLength(4);
    model.length = 1;
    options.build(field);

    expect(form.controls).toHaveLength(1);
  });

  it('should keep tracking model change on resetModel', () => {
    const { field } = renderComponent({
      key: 'address',
      type: 'array',
      defaultValue: [{}, {}, {}, {}],
      fieldArray: {
        fieldGroup: [{ key: 'name', type: 'input' }],
      },
    });
    const { options, formControl } = field;
    const form = formControl as FormArray;

    expect(form.controls).toHaveLength(4);

    options.resetModel({ address: [{}] });
    expect(form.controls).toHaveLength(1);

    form.get('0.name').patchValue('TEST');
    const { model } = field;
    expect(model[0]).toEqual({ name: 'TEST' });
  });

  it('should detect changes on re-build', () => {
    const { field, queryAll, detectChanges } = renderComponent({
      key: 'address',
      type: 'array',
      defaultValue: [1],
      hooks: {
        onInit: (f) => (f.model.length = 4),
      },
    });

    expect(queryAll('formly-array > formly-field')).toHaveLength(1);

    field.model.length = 4;
    field.options.build(field.parent);
    detectChanges();

    expect(queryAll('formly-array > formly-field')).toHaveLength(4);
  });

  describe('resetFieldOnHide', () => {
    it('should set default value', () => {
      const { field } = renderComponent(
        {
          key: 'foo',
          type: 'array',
          defaultValue: [null],
          fieldArray: { type: 'input' },
        },
        { extras: { resetFieldOnHide: true } },
      );
      expect(field.model).toEqual([null]);
      expect(field.fieldGroup.length).toEqual(1);
    });

    it('should toggle default value on hide changes', () => {
      const { field, detectChanges } = renderComponent(
        {
          key: 'foo',
          type: 'array',
          defaultValue: [null],
          fieldArray: { type: 'input' },
          hide: true,
        },
        { extras: { resetFieldOnHide: true } },
      );

      expect(field.model).toEqual(undefined);
      expect(field.fieldGroup.length).toEqual(0);

      field.hide = false;
      field.options.checkExpressions(field.parent);
      detectChanges();
      expect(field.model).toEqual([null]);
      expect(field.fieldGroup.length).toEqual(1);
    });

    it('should set default value when insert at index', () => {
      const { field, query, detectChanges } = renderComponent(
        {
          key: 'foo',
          type: 'array',
          defaultValue: [null],
          resetOnHide: true,
          fieldArray: { type: 'input', defaultValue: 'default', expressions: { hide: () => false } },
        },
        { extras: { resetFieldOnHide: true } },
      );

      detectChanges();
      expect(field.model).toEqual([null]);

      const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
      arrayType.add(0);
      detectChanges();

      expect(field.model).toEqual(['default', null]);
    });

    it('should set default value when insert', () => {
      const { field, query, detectChanges } = renderComponent(
        {
          expressions: { hide: () => false },
          fieldGroup: [
            {
              key: 'foo',
              type: 'array',
              defaultValue: [],
              fieldArray: { type: 'input', defaultValue: 'default' },
            },
          ],
        },
        { extras: { resetFieldOnHide: true } },
      );

      detectChanges();
      expect(field.model.foo).toEqual([]);

      const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
      arrayType.add(0);
      detectChanges();

      expect(field.model.foo).toEqual(['default']);
    });
  });

  it('should set default value for hidden fields', () => {
    const { field, query, detectChanges } = renderComponent({
      key: 'foo',
      type: 'array',
      expressions: { hide: () => false },
      fieldArray: {
        defaultValue: 'test',
        type: 'input',
      },
    });

    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;
    arrayType.add();
    detectChanges();
    expect(field.form.value).toEqual({ foo: ['test'] });
  });
});

@Component({
  selector: 'formly-array',
  template: `
    @for (field of field.fieldGroup; track field; let i = $index) {
      <formly-field [field]="field"></formly-field>
      <button [id]="'remove-' + i" type="button" (click)="remove(i)">Remove</button>
    }
    <button id="add" type="button" (click)="add()">Add</button>
  `,
  standalone: false,
})
class ArrayTypeComponent extends FieldArrayType {}
