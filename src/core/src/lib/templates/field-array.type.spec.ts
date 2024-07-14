import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldArrayType } from './field-array.type';
import { FormlyInputModule, createFieldComponent, createFieldChangesSpy } from '@ngx-formly/core/testing';
import { FormArray } from '@angular/forms';
import { renderComponent as renderFormComponent } from '../components/formly.form.spec';

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
    const spy = jest.fn();
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

    const spy = jest.fn();
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

    const spy = jest.fn();
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
    expect(formControl.dirty).toBeFalse();
    query('#add').triggerEventHandler('click', {});
    detectChanges();
    expect(formControl.dirty).toBeTrue();

    formControl.markAsPristine();
    query('#remove-0').triggerEventHandler('click', {});
    detectChanges();
    expect(formControl.dirty).toBeTrue();
  });

  it('should not mark the form dirty on Add/Remove', () => {
    const { field, query, detectChanges } = renderComponent({
      key: 'array',
      type: 'array',
    });

    expect(field.form.dirty).toBeFalse();

    const arrayType = query('formly-array').componentInstance as ArrayTypeComponent;

    arrayType.add(null, null, { markAsDirty: false });
    detectChanges();
    expect(field.form.dirty).toBeFalse();

    field.form.markAsPristine();

    arrayType.remove(0, { markAsDirty: false });
    detectChanges();
    expect(field.form.dirty).toBeFalse();
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
    expect(cityField.hide).toBeTrue();
    expect(cityField.className).toEqual('test');

    model[0] = 'custom';
    options.checkExpressions(cityField);
    detectChanges();

    expect(cityField.hide).toBeFalse();
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
    <ng-container *ngFor="let field of field.fieldGroup; let i = index">
      <formly-field [field]="field"></formly-field>
      <button [id]="'remove-' + i" type="button" (click)="remove(i)">Remove</button>
    </ng-container>
    <button id="add" type="button" (click)="add()">Add</button>
  `,
})
class ArrayTypeComponent extends FieldArrayType {}
