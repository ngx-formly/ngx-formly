import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component } from '@angular/core';
import { FormlyModule } from '../core';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

describe('Formly Form Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [FormlyModule.forRoot()]});
  });

  it('should initialize inputs with default values', () => {
    createTestComponent('<formly-form></formly-form>');
  });
});

@Component({selector: 'formly-form-test', template: '', entryComponents: []})
class TestComponent {
}
