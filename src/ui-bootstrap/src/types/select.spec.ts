import { TestBed, ComponentFixture, fakeAsync, tick, async } from '@angular/core/testing';
import { createGenericTestComponent } from '../../../core/src/test-utils';
import { By } from '@angular/platform-browser';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormlyModule, FormlyFormBuilder } from '../../../core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormlyFieldSelect } from './select';
import { FormlyForm } from '../../../core';
import { of } from 'rxjs/observable/of';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

let testComponentInputs;

describe('ui-bootstrap: Formly Field Select Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent, FormlyFieldSelect], imports: [FormlyModule.forRoot({
      types: [
        {
          name: 'select',
          component: FormlyFieldSelect,
        }
      ]
    })]});
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
                ],
                valueProp: 'id',
                labelProp: 'name',
            }
        }];

        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
        
        expect(fixture.debugElement.query(By.css('select')).nativeElement.options.length).toEqual(2);
    });

    it('should correctly bind to an Observable', async(() => {
      const sports$ = of([
        { id: '1', name: 'Soccer' },
        { id: '2', name: 'Basketball' },
      ]);

      testComponentInputs.fields = [{
          key: 'sportId',
          type: 'select',
          templateOptions: {
              options: sports$,
              valueProp: 'id',
              labelProp: 'name',
          }
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      
      expect(fixture.debugElement.query(By.css('select')).nativeElement.options.length).toEqual(2);
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
