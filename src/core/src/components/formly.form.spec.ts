import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';
import { FormlyWrapperLabel, FormlyFieldText } from './formly.field.spec';

import { Component, OnInit } from '@angular/core';
import { FormlyModule } from '../core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { FormlyFieldConfig } from './formly.field.config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

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
        [options]="newOptions"
        [form]="control">
      </formly-form>
      <button (click)="remove(i)">Remove</button>
    </div>
  `,
})
export class RepeatComponent extends FieldType implements OnInit {
  get newOptions() {
    return { ...this.options };
  }
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
