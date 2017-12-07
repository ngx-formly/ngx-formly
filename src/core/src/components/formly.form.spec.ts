import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';
import { FormlyWrapperLabel, FormlyFieldText } from './formly.field.spec';

import { Component, OnInit } from '@angular/core';
import { FormlyModule } from '../core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { FormlyFieldConfig } from './formly.field.config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyFieldElement(element: HTMLElement): HTMLInputElement {
  return <HTMLInputElement> element.querySelector('formly-field');
}

let testComponentInputs;

describe('Formly Form Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent, FormlyFieldText, FormlyWrapperLabel, RepeatComponent], imports: [FormlyModule.forRoot({
      types: [
        {
          name: 'text',
          component: FormlyFieldText,
        },
        {
          name: 'other',
          component: FormlyFieldText,
          wrappers: ['label'],
        },
        {
          name: 'repeat',
          component: RepeatComponent,
        },
      ],
      wrappers: [{
        name: 'label',
        component: FormlyWrapperLabel,
      }],
    })]});
  });

  it('should initialize inputs with default values', () => {
    testComponentInputs = {
      fields: [{
        fieldGroup: [{
          key: 'name',
          type: 'text',
        }],
      }, {
        key: 'investments',
        type: 'repeat',
        fieldArray: {
          fieldGroup: [{
            key: 'investmentName',
            type: 'text',
          }],
        },
      }],
      form: new FormGroup({}),
      options: {},
      model: {
        investments: [{investmentName: 'FA'}, {}],
      },
    };
    createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
    testComponentInputs.form.controls.investments.removeAt(1);
    testComponentInputs.options.resetModel();
  });

  describe('hideExpression', () => {
    let field;

    beforeEach(() => {
      field = {
        key: 'title',
        type: 'text',
        templateOptions: {
          label: 'Title',
          placeholder: 'Title',
        },
      };
      testComponentInputs = { fields: [field], model: { address: { city: '' } } };
    });

    it('should hide field using a string expression', () => {
      field.hideExpression = 'true';

      const fixture = createTestComponent('<formly-form [fields]="fields"></formly-form>');
      expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('display: none;');
    });

    it('should hide field using a function', () => {
      field.hideExpression = () => true;

      const fixture = createTestComponent('<formly-form [fields]="fields"></formly-form>');
      expect(getFormlyFieldElement(fixture.nativeElement).getAttribute('style')).toEqual('display: none;');
    });

    it('should apply model changes when form is enabled', () => {
      const form = new FormGroup({});
      testComponentInputs.form = form;
      testComponentInputs.model = {};
      testComponentInputs.fields = [{
        key: 'address',
        hideExpression: () => true,
        fieldGroup: [{
          key: 'city',
          type: 'text',
        }],
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(form.get('address')).toBeNull();

      testComponentInputs.fields[0].hideExpression = () => false;
      testComponentInputs.model.address.city = 'test';
      fixture.detectChanges();
      expect(form.get('address.city').value).toEqual('test');
    });

    it('should hide/display field using a function with nested field key', fakeAsync(() => {
      const form = new FormGroup({});
      testComponentInputs.form = form;
      testComponentInputs.model = { address: { city: '' } };
      field.key = 'address.city';
      field.hideExpression = '!(model.address && model.address.city === "agadir")';

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      tick(1);
      expect(form.get('address.city')).toBeNull();

      testComponentInputs.model.address.city = 'agadir';
      fixture.detectChanges();
      tick(1);
      expect(form.get('address.city')).not.toBeNull();
      expect(form.get('address.city').value).toEqual('agadir');
    }));
  });

  it('expression properties', () => {
    testComponentInputs = {
      fields: [{
        key: 'title',
        type: 'text',
        optionsTypes: ['other'],
        templateOptions: {
          placeholder: 'Title',
          disabled: true,
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.title !== undefined',
        },
      }],
      form: new FormGroup({}),
      model: {},
    };

    createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
    expect(testComponentInputs.fields[0].templateOptions.disabled).toEqual(false);
  });
});

@Component({selector: 'formly-form-test', template: '', entryComponents: []})
class TestComponent {
  fields = testComponentInputs.fields;
  form = testComponentInputs.form;
  model = testComponentInputs.model || {};
  options = testComponentInputs.options;
}

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div *ngFor="let control of controls; let i = index;">
      <formly-form
        [model]="model[i]"
        [fields]="fields"
        [options]="options"
        [form]="control">
      </formly-form>
      <button (click)="remove(i)">Remove</button>
    </div>
  `,
})
export class RepeatComponent extends FieldType implements OnInit {
  get controls() {
    return this.form.controls[this.field.key]['controls'];
  }

  get fields(): FormlyFieldConfig[] {
    return this.field.fieldArray.fieldGroup;
  }

  remove(i) {
    this.form.controls[this.field.key]['controls'].splice(i, 1);
    this.model.splice(i, 1);
  }

  ngOnInit() {
    if (this.model) {
      this.model.map(() => {
        let formGroup = new FormGroup({});
        this.form.controls[this.field.key]['controls'].push(formGroup);
      });
    }
  }
}
