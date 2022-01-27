import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { createGenericTestComponent } from '../../../../core/src/lib/test-utils';
import { By } from '@angular/platform-browser';

import { Component, ViewChild } from '@angular/core';
import { FormlyModule, FormlyForm } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldSelect } from './select';
import { of as observableOf } from 'rxjs';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

let testComponentInputs;

describe('ui-bootstrap: Formly Field Select Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FormlyFieldSelect],
      imports: [
        ReactiveFormsModule,
        FormlySelectModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'select',
              component: FormlyFieldSelect,
            },
          ],
        }),
      ],
    });
  });

  it(`should call change callback after formControl update`, () => {
    const changeFnSpy = jasmine.createSpy();
    testComponentInputs = {
      form: new FormGroup({}),
      options: {},
      model: {},
      fields: [{
        key: 'sportId',
        type: 'select',
        templateOptions: {
          placeholder: 'sport',
          change: (f) => changeFnSpy(f.formControl.value),
          options: [
            { value: '1', label: 'Soccer' },
          ],
        },
      }],
    };


    const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
    expect(testComponentInputs.fields[0].formControl.value).toEqual(null);

    const select = fixture.debugElement.query(By.css('select')).nativeElement as HTMLSelectElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));

    expect(changeFnSpy).toHaveBeenCalledWith('1');
    expect(testComponentInputs.fields[0].formControl.value).toEqual('1');
  });

  describe('options', () => {
    beforeEach(() => {
      testComponentInputs = {
        form: new FormGroup({}),
        options: {},
        model: {},
      };
    });

    it('should correctly bind to a static array of data', () => {
      testComponentInputs.fields = [{
        key: 'sportId',
        type: 'select',
        templateOptions: {
          options: [
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: {test: 'A'}, name: 'Not Soccer or Basketball' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      expect(fixture.debugElement.query(By.css('select')).nativeElement.options.length).toEqual(3);
    });

    it('should correctly bind to an Observable', async(() => {
      const sports$ = observableOf([
        { id: '1', name: 'Soccer' },
        { id: '2', name: 'Basketball' },
        { id: {test: 'A'}, name: 'Not Soccer or Basketball' },
      ]);

      testComponentInputs.fields = [{
        key: 'sportId',
        type: 'select',
        templateOptions: {
          options: sports$,
          valueProp: 'id',
          labelProp: 'name',
        },
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      expect(fixture.debugElement.query(By.css('select')).nativeElement.options.length).toEqual(3);
    }));

  });

});

@Component({selector: 'formly-form-test', template: '', entryComponents: []})
class TestComponent {
  @ViewChild(FormlyForm) formlyForm: FormlyForm;

  fields = testComponentInputs.fields;
  form = testComponentInputs.form;
  model = testComponentInputs.model || {};
  options = testComponentInputs.options;
}
