import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component } from '@angular/core';

import { FormlyForm } from './formly.form';
import { FormlyModule } from '../core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyUtils } from './../services/formly.utils';

// tslint:disable-next-line
const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

describe('Formly Form Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [FormlyModule.forRoot()]});
  });

  it('should initialize inputs with default values', () => {
    const formlyForm = new FormlyForm(new FormlyConfig([], new FormlyUtils()), new FormlyUtils());

    expect(formlyForm.model).toEqual({});
    expect(formlyForm.fields).toEqual([]);
  });
});

@Component({selector: 'formly-form-test', template: '', entryComponents: []})
class TestComponent {
}
