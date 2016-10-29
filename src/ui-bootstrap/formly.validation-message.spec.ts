import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../core/test-utils';

import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormlyModule } from '../core/core';
import { FormlyValidationMessage } from './formly.validation-message';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyValidationMessageElement(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('formly-validation-message');
}

describe('FormlyValidationMessage Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormlyValidationMessage, TestComponent],
      imports: [
        FormlyModule.forRoot({
          validationMessages: [
            { name: 'required', message: (err, field) => `${field.templateOptions.label} is required.`},
            { name: 'maxlength', message: 'Maximum Length Exceeded.' },
          ],
        }),
      ],
    });
  });

  it('should not render message with a valid value', () => {
    const fixture = createTestComponent('<formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message>');
    const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
    fixture.componentInstance.formControl.setValue('12');
    fixture.detectChanges();

    expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
    expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
  });

  it('should render message with a dynamic validation message', () => {
    const fixture = createTestComponent('<formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message>');
    const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);

    expect(formlyMessageElm.textContent).toMatch(/Title is required/);
        expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
  });

  it('should render message with a simple validation message', () => {
    const fixture = createTestComponent('<formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message>');
    const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
    fixture.componentInstance.formControl.setValue('test');
    fixture.detectChanges();

    expect(formlyMessageElm.textContent).toMatch(/Maximum Length Exceeded/);
    expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
  });
});

@Component({selector: 'formly-validation-message-test', template: '', entryComponents: []})
class TestComponent {
  formControl = new FormControl(null, [Validators.required, Validators.maxLength(3)]);
  field = {
    type: 'input',
    key: 'title',
    templateOptions: {
      label: 'Title',
    },
  };
}
