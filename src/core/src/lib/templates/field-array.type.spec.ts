import { Component } from '@angular/core';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldArrayType } from './field-array.type';
import { FormlyInputModule, createFormlyFieldComponent, createFieldChangesSpy } from '@ngx-formly/core/testing';
import { FormArray } from '@angular/forms';
import { ComponentFixture } from '@angular/core/testing';

function getFormlyArrayField(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.nativeElement.querySelector('formly-array');
}

function getFormlyArrayFields(fixture: ComponentFixture<any>): HTMLInputElement[] {
  return fixture.nativeElement.querySelectorAll('formly-array > formly-field');
}

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
    const fixture = renderComponent({
      key: 'foo',
      type: 'array',
      defaultValue: [null, null],
    });

    expect(getFormlyArrayField(fixture)).toBeDefined();
    expect(getFormlyArrayFields(fixture).length).toEqual(2);
  });

  it('should add defaultOptions', () => {
    const fixture = renderComponent({
      key: 'foo',
      type: 'array',
    });

    const model = fixture.componentInstance.field.parent.model;
    expect(model).toEqual({ foo: [] });
  });

  it('should support field without key', () => {
    const fixture = renderComponent({ model: [], type: 'array' });
    const { field } = fixture.componentInstance;
    expect(field.model).toEqual([]);

    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(field.model).toEqual([undefined]);

    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    expect(field.model).toEqual([]);
  });

  it('should work with nullable model', () => {
    const fixture = renderComponent({
      model: { array: null },
      key: 'array',
      type: 'array',
    });
    const { field } = fixture.componentInstance;

    expect(field.fieldGroup).toEqual([]);
    expect(field.model).toBeNull();

    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(field.fieldGroup.length).toEqual(1);
    expect(field.model.length).toBe(1);
  });

  it('should emit `modelChange` on Add/Remove', () => {
    const fixture = renderComponent({
      key: 'array',
      type: 'array',
    });

    const { field } = fixture.componentInstance;
    const [spy, subscription] = createFieldChangesSpy(field);
    const form = field.formControl as FormArray;

    // add
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ value: [undefined], field, type: 'valueChanges' });
    expect(field.parent.model).toEqual({ array: [undefined] });

    // update
    spy.mockReset();
    form.at(0).patchValue('***');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ value: '***', field: field.fieldGroup[0], type: 'valueChanges' });
    expect(field.parent.model).toEqual({ array: ['***'] });

    // remove
    spy.mockReset();
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ value: [], field, type: 'valueChanges' });
    expect(field.parent.model).toEqual({ array: [] });

    subscription.unsubscribe();
  });

  it('should not triggers valueChanges for all fields on add/remove', () => {
    app.fields = [
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
    ];

    const fixture = createFormlyTestComponent();
    const spy = jasmine.createSpy('model change spy');
    const subscription = app.form.get('bar').valueChanges.subscribe(spy);

    // add
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();

    // remove
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('should share formControl when field key is duplicated', () => {
    app.fields = [
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
    ];

    createFormlyTestComponent();
    expect(app.fields[0].formControl).toEqual(app.fields[1].formControl);
  });

  it('should not reuse the remove controls', () => {
    const fixture = renderComponent({
      key: 'array',
      type: 'array',
    });
    const { field } = fixture.componentInstance;
    const form = field.formControl as FormArray;

    fixture.nativeElement.querySelector('#add').click();
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('#add').click();
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    form.at(0).setValue('foo');

    expect(form.at(1)).not.toEqual(form.at(0));
    expect(form.at(1).value).toEqual(null);
  });

  // https://github.com/ngx-formly/ngx-formly/issues/2493
  it('should add field when model is null', () => {
    const fixture = renderComponent({
      model: null,
      key: 'array',
      type: 'array',
    });
    const { field } = fixture.componentInstance;
    const form = field.formControl as FormArray;

    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(field.fieldGroup.length).toEqual(1);
    expect(form.value).toEqual({ array: [null] });
  });

  it('should mark the form dirty on Add/Remove', () => {
    const fixture = renderComponent({
      key: 'array',
      type: 'array',
    });

    const {
      field: { formControl },
    } = fixture.componentInstance;

    expect(formControl.dirty).toBeFalsy();
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();
    expect(formControl.dirty).toBeTruthy();

    formControl.markAsPristine();
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();
    expect(formControl.dirty).toBeTruthy();
  });

  it('should not change the form control instance when chinging the field position', () => {
    const fixture = renderComponent({
      model: { foo: [1, 2] },
      key: 'foo',
      type: 'array',
      fieldArray: { type: 'input' },
    });
    const { field } = fixture.componentInstance;
    const formArray = field.formControl as FormArray;

    const formControl = formArray.at(1);
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    expect(formArray.controls.length).toEqual(1);
    expect(formArray.at(0)).toEqual(formControl);
  });

  it('should apply expressions within field arrays', () => {
    const fixture = renderComponent({
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
    } = fixture.componentInstance.field;
    expect(cityField.hide).toBeTruthy();
    expect(cityField.className).toEqual('test');

    model[0] = 'custom';
    (options as any)._checkField(cityField);
    fixture.detectChanges();

    expect(cityField.hide).toBeFalsy();
    expect(cityField.className).toEqual('custom');
  });

  it('should cleanup existing controls on re-build', () => {
    const fixture = renderComponent({
      key: 'address',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
    });
    const { model, options, formControl } = fixture.componentInstance.field;
    const form = formControl as FormArray;

    expect(form.controls.length).toEqual(4);
    model.length = 1;
    (options as any)._buildField(fixture.componentInstance.field);

    expect(form.controls.length).toEqual(1);
  });

  it('should keep tracking model change on resetModel', () => {
    const fixture = renderComponent({
      key: 'address',
      type: 'array',
      defaultValue: [{}, {}, {}, {}],
      fieldArray: {
        fieldGroup: [{ key: 'name', type: 'input' }],
      },
    });
    const { options, formControl } = fixture.componentInstance.field;
    const form = formControl as FormArray;

    expect(form.controls.length).toEqual(4);

    options.resetModel({ address: [{}] });
    expect(form.controls.length).toEqual(1);

    form.get('0.name').patchValue('TEST');
    const model = fixture.componentInstance.field.model;
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
