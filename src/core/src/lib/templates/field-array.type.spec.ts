import { TestBed } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormlyModule, FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FieldArrayType } from './field-array.type';
import { FormlyFieldText } from '../components/formly.field.spec';
import { By } from '@angular/platform-browser';

function createFormlyTestComponent() {
  return createGenericTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>', TestComponent);
}

let app: Partial<{
  form: FormGroup | FormArray;
  fields: FormlyFieldConfig[];
  options: FormlyFormOptions;
  model: any;
}>;

describe('Array Field Type', () => {
  beforeEach(() => {
    app = {
      form: new FormGroup({}),
      model: {},
    };
    TestBed.configureTestingModule({
      declarations: [TestComponent, ArrayTypeComponent, FormlyFieldText],
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [
            {
                name: 'input',
                component: FormlyFieldText,
            },
            {
              name: 'array',
              component: ArrayTypeComponent,
            },
          ],
        }),
      ],
    });
  });

  it('should mark the form dirty on Add/Remove', () => {
    app.model = { array: null };
    app.fields = [{
      key: 'array',
      type: 'array',
    }];

    const fixture = createFormlyTestComponent();
    expect(app.form.dirty).toBeFalsy();

    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();
    expect(app.form.dirty).toBeTruthy();

    app.form.markAsPristine();
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();
    expect(app.form.dirty).toBeTruthy();
  });

  it('should work with nullable model', () => {
    app.model = { array: null };
    app.fields = [{
      key: 'array',
      type: 'array',
      defaultValue: null,
    }];

    const fixture = createFormlyTestComponent();
    expect(app.form.dirty).toBeFalsy();

    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();
    expect(app.form.dirty).toBeTruthy();

    app.form.markAsPristine();
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();
    expect(app.form.dirty).toBeTruthy();
  });

  it('should support field without key', () => {
    app.form = new FormArray([]);
    app.fields = [{ type: 'array' }];
    app.model = [];

    const fixture = createFormlyTestComponent();
    expect(app.model).toEqual([]);

    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(app.model).toEqual([undefined]);

    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    expect(app.model).toEqual([]);
  });

  it('should not mark the form dirty on Add/Remove', () => {
    app.model = { array: null };
    app.fields = [{
      key: 'array',
      type: 'array',
    }];

    const fixture = createFormlyTestComponent();
    expect(app.form.dirty).toBeFalsy();

    const arrayType = fixture.debugElement.query(By.css('formly-array-type'))
      .componentInstance as ArrayTypeComponent;

    arrayType.add(null, null, { markAsDirty: false });
    fixture.detectChanges();
    expect(app.form.dirty).toBeFalsy();

    app.form.markAsPristine();

    arrayType.remove(0, { markAsDirty: false });
    fixture.detectChanges();
    expect(app.form.dirty).toBeFalsy();
  });

  it('should work with nullable model', () => {
    app.model = { array: null };
    app.fields = [{
      key: 'array',
      type: 'array',
    }];

    const fixture = createFormlyTestComponent();
    expect(app.fields[0].fieldGroup).toEqual([]);
    expect(app.fields[0].model).toBeNull();

    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(app.fields[0].fieldGroup.length).toEqual(1);
    expect(app.fields[0].model.length).toBe(1);
  });

  it('should keep formControl instance on remove item for repeat section', () => {
    app.model = { foo: [1, 2] };
    app.fields = [{
      key: 'foo',
      type: 'array',
      fieldArray: { type: 'input' },
    }];

    const fixture = createFormlyTestComponent();
    const formArray = app.fields[0].formControl as FormArray;

    const formControl = formArray.at(1);
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    expect(formArray.controls.length).toEqual(1);
    expect(formArray.at(0)).toEqual(formControl);
  });

  it('should emit `modelChange` on model change', () => {
    app.fields = [{
      key: 'foo',
      type: 'array',
      fieldArray: {
        fieldGroup: [{
          key: 'title',
          type: 'input',
        }],
      },
    }];

    const fixture = createFormlyTestComponent();
    const spy = jasmine.createSpy('model change spy');
    const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

    // add
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ foo: [{}] });

    // update
    const formArray = app.form.get('foo') as FormArray;
    formArray.at(0).get('title').patchValue('***');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ foo: [{ title: '***' }] });
    expect(app.model).toEqual({ foo: [{ title: '***' }] });

    // remove
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ foo: [] });
    expect(app.model).toEqual({ foo: [] });

    expect(spy).toHaveBeenCalledTimes(3);
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
    app.model = { array: null };
    app.fields = [{
      key: 'array',
      type: 'array',
    }];

    const fixture = createFormlyTestComponent();

    fixture.nativeElement.querySelector('#add').click();
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.nativeElement.querySelector('#remove-0').click();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('#add').click();
    fixture.nativeElement.querySelector('#add').click();
    fixture.detectChanges();

    const form = app.form.get('array') as FormArray;
    form.at(0).setValue('foo');

    expect(form.at(1)).not.toEqual(form.at(0));
    expect(form.at(1).value).toEqual(null);
  });
});

@Component({ selector: 'formly-form-test', template: '', entryComponents: [] })
class TestComponent {
  @ViewChild(FormlyForm) formlyForm: FormlyForm;

  fields = app.fields;
  form = app.form;
  model = app.model;
  options = app.options;
}

@Component({
  selector: 'formly-array-type',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index;">
      <formly-group [field]="field"></formly-group>
      <button [id]="'remove-' + i" type="button" (click)="remove(i)">Remove</button>
    </div>
    <button id="add" type="button" (click)="add()">Add</button>
  `,
})
class ArrayTypeComponent extends FieldArrayType {}
