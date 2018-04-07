import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { createGenericTestComponent } from '../../../core/src/test-utils';
import { By } from '@angular/platform-browser';

import { Component, ViewChild } from '@angular/core';
import { FormlyModule } from '../../../core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldSelect } from './select';
import { FormlyForm } from '../../../core';
import { of as observableOf } from 'rxjs/observable/of';

const createTestComponent = (html: string) =>
  createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

let testComponentInputs;

describe('ui-material: Formly Field Select Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FormlyFieldSelect],
      imports: [
        NoopAnimationsModule,
        MatSelectModule,
        ReactiveFormsModule,
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

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'),
        trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
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

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>'),
        trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
    }));

  });

});

@Component({ selector: 'formly-form-test', template: '', entryComponents: [] })
class TestComponent {
  @ViewChild(FormlyForm) formlyForm: FormlyForm;

  fields = testComponentInputs.fields;
  form = testComponentInputs.form;
  model = testComponentInputs.model || {};
  options = testComponentInputs.options;
}
