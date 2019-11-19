import { Component } from '@angular/core';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldArrayType } from './field-array.type';
import { FormlyInputModule, createFormlyFieldComponent, createFieldChangesSpy } from '@ngx-formly/core/testing';
import { FormArray } from '@angular/forms';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    declarations: [ArrayTypeComponent],
    imports: [
      FormlyInputModule,
      FormlyModule.forChild({
        types: [
          {
            name: 'array',
            component: ArrayTypeComponent,
          },
        ],
      }),
    ],
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
        hideExpression: 'model[0] === "test"',
        expressionProperties: {
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
    (options as any)._checkField(cityField);
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
    (options as any)._buildField(field);

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
