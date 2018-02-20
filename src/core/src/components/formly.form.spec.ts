import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';
import { FormlyWrapperLabel, FormlyFieldText } from './formly.field.spec';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormlyModule } from '../core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { FormlyFieldConfig, FormlyFormOptions } from './formly.field.config';
import { FormlyForm } from './formly.form';

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

  describe('modelChange output', () => {
    beforeEach(() => {
      testComponentInputs = {
        form: new FormGroup({}),
        options: {},
        model: {},
      };
    });

    it('should emit to `modelChange` when model is changed', () => {
      testComponentInputs.fields = [{
        key: 'title',
        type: 'text',
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      testComponentInputs.form.get('title').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ title: '***' });
      subscription.unsubscribe();
    });

    it('should emit to `modelChange` when nested model is changed ', () => {
      testComponentInputs.fields = [{
        key: 'address',
        fieldGroup: [{
          fieldGroup: [{
            key: 'city',
            type: 'text',
          }],
        }],
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      testComponentInputs.form.get('address.city').patchValue('***');

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ address: { city: '***' } });
      subscription.unsubscribe();
    });

    it('should emit to `modelChange` when nested model is changed through expressionProperties', () => {
      testComponentInputs.fields = [{
        key: 'test',
        type: 'text',
        expressionProperties: {
          'model.test': 'model.title',
        },
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');
      const spy = jasmine.createSpy('model change spy');
      const subscription = fixture.componentInstance.formlyForm.modelChange.subscribe(spy);

      testComponentInputs.model.title = '***';

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ title: '***', test: '***' });
      subscription.unsubscribe();
    });
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
      testComponentInputs.model = { address: [{ city: '' }] };
      field.key = 'address[0].city';
      field.hideExpression = '!(model.address && model.address[0] && model.address[0].city === "agadir")';

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      tick(1);
      expect(form.get('address.0.city')).toBeNull();

      testComponentInputs.model.address[0].city = 'agadir';
      fixture.detectChanges();
      tick(1);
      expect(form.get('address.0.city')).not.toBeNull();
      expect(form.get('address.0.city').value).toEqual('agadir');
    }));

    it('should hide/display child fields when field has empty key', fakeAsync(() => {
      const form = new FormGroup({});
      testComponentInputs.form = form;
      testComponentInputs.model = {};
      testComponentInputs.fields = [{
        hideExpression: () => true,
        fieldGroup: [{
          fieldGroup: [
            {
              key: 'city',
              type: 'text',
            },
            {
              key: 'zipCode',
              type: 'text',
              hideExpression: () => false,
            },
          ],
        }],
      }];

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      tick(1);
      expect(form.get('city')).toBeNull();
      expect(form.get('zipCode')).toBeNull();

      testComponentInputs.fields[0].hideExpression = () => false;
      fixture.detectChanges();
      expect(form.get('city')).not.toBeNull();
      expect(form.get('zipCode')).not.toBeNull();
    }));
  });

  describe('expressionProperties', () => {
    let field, model, form: FormGroup;

    beforeEach(() => {
      form = new FormGroup({});
      model = {};
      field = {
        key: 'title',
        type: 'text',
        templateOptions: {
          placeholder: 'Title',
        },
      };
      testComponentInputs = { fields: [field], model, form };
    });

    it('should update className', () => {
      field.expressionProperties = {
        'field.className': 'model.title',
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(field.className).toEqual(undefined);

      model.title = 'test';
      fixture.detectChanges();

      expect(field.className).toEqual('test');
    });

    describe('model', () => {
      it('should update model and assign it into formControl', () => {
        model.title = 'test';
        field.expressionProperties = {
          'model.title': `this.field.templateOptions.disabled ? '':model.title`,
        };

        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
        expect(model.title).toEqual('test');
        expect(field.formControl.value).toEqual('test');

        field.templateOptions.disabled = true;
        fixture.detectChanges();

        expect(model.title).toEqual('');
        expect(field.formControl.value).toEqual('');
      });

      it('should update model and assign it into formControl within nested form', () => {
        model.title = 'test';
        field.expressionProperties = {
          'model.title': `this.field.templateOptions.disabled ? '':model.title`,
        };

        delete field.key;
        delete field.type;
        field.fieldGroup = [
          {
            key: 'title',
            type: 'text',
            templateOptions: {
              placeholder: 'Title',
            },
          },
        ];

        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
        expect(model.title).toEqual('test');
        expect(field.fieldGroup[0].formControl.value).toEqual('test');

        field.templateOptions.disabled = true;
        fixture.detectChanges();

        expect(model.title).toEqual('');
        expect(field.fieldGroup[0].formControl.value).toEqual('');
      });
    });

    it('should enable/disalbe formControl on templateOptions.disabled is set', () => {
      field.expressionProperties = {
        'templateOptions.disabled': 'model.title !== undefined',
      };

      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');
      expect(field.templateOptions.disabled).toEqual(false);
      expect(form.get('title').enabled).toEqual(true);

      model.title = 'test';
      fixture.detectChanges();

      expect(field.templateOptions.disabled).toEqual(true);
      expect(form.get('title').enabled).toEqual(false);
    });

    const options = [
      { name: 'required', value: true, invalid: null },
      { name: 'pattern', value: '[0-9]{5}', invalid: 'ddd' },
      { name: 'minLength', value: 5, invalid: '123' },
      { name: 'maxLength', value: 10, invalid: '12345678910' },
      { name: 'min', value: 5, invalid: 3 },
      { name: 'max', value: 10, invalid: 11 },
    ];

    options.forEach(option => {
      it(`templateOptions.${option.name}`, () => {
        let enableExpression = true;
        field.expressionProperties = {
          [`templateOptions.${option.name}`]: () => {
            return enableExpression ? option.value : false;
          },
        };
        model.title = option.invalid;
        const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>');

        expect(field.templateOptions[option.name]).toEqual(option.value);
        expect(form.valid).toEqual(false);

        enableExpression = false;
        fixture.detectChanges();

        expect(field.templateOptions[option.name]).toEqual(false);
        expect(form.valid).toEqual(true);
      });
    });
  });

  describe('options', () => {
    let field, model, form: FormGroup, options: FormlyFormOptions;
    beforeEach(() => {
      form = new FormGroup({});
      model = {};
      options = {};
      field = {
        key: 'title',
        type: 'text',
        templateOptions: {
          placeholder: 'Title',
        },
      };
      testComponentInputs = { fields: [field], model, form, options };
    });

    it('resetForm', () => {
      // initial value
      model.title = 'test';
      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      form.get('title').setValue('edit title');
      fixture.detectChanges();

      expect(model.title).toEqual('edit title');

      options.resetModel();
      expect(model.title).toEqual('test');
    });

    it('updateInitialValue', () => {
      // initial value
      model.title = 'test';
      const fixture = createTestComponent('<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>');

      form.get('title').setValue('edit title');
      fixture.detectChanges();

      expect(model.title).toEqual('edit title');
      options.updateInitialValue();

      options.resetModel();
      expect(model.title).toEqual('edit title');
    });
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
      this.model.forEach(() => {
        const formGroup = new FormGroup({});
        this.form.controls[this.field.key]['controls'].push(formGroup);
      });
    }
  }
}
