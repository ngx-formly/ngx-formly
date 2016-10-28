import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyModule } from '../core';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyMessageElement(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('formly-message');
}

describe('FormlyMessage Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormlyModule.forRoot({
        validationMessages: [
          { name: 'required', message: (err, field) => `${field.templateOptions.label} is required.`},
          { name: 'maxlength', message: 'Maximum Length Exceeded.' },
        ],
      })],
    });
  });

  it('should not render message with a valid value', () => {
    const fixture = createTestComponent('<formly-message [form]="form" [field]="field" [controlName]="field.key"></formly-message>');
    const formlyMessageElm = getFormlyMessageElement(fixture.nativeElement);
    fixture.componentInstance.form.get('title').setValue('12');
    fixture.detectChanges();

    expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
    expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
  });

  it('should render message with a dynamic validation message', () => {
    const fixture = createTestComponent('<formly-message [form]="form" [field]="field" [controlName]="field.key"></formly-message>');
    const formlyMessageElm = getFormlyMessageElement(fixture.nativeElement);

    expect(formlyMessageElm.textContent).toMatch(/Title is required/);
        expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
  });

  it('should render message with a simple validation message', () => {
    const fixture = createTestComponent('<formly-message [form]="form" [field]="field" [controlName]="field.key"></formly-message>');
    const formlyMessageElm = getFormlyMessageElement(fixture.nativeElement);
    fixture.componentInstance.form.get('title').setValue('test');
    fixture.detectChanges();

    expect(formlyMessageElm.textContent).toMatch(/Maximum Length Exceeded/);
    expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
  });
});

@Component({selector: 'formly-message-test', template: '', entryComponents: []})
class TestComponent {
  form = new FormGroup({ title: new FormControl(null, [Validators.required, Validators.maxLength(3)]) });
  controlName;
  field = {
    type: 'input',
    key: 'title',
    templateOptions: {
      label: 'Title',
    },
  };
}
