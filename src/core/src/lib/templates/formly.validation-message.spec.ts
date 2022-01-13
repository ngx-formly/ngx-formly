import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '../core';
import { of, Subject } from 'rxjs';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getFormlyValidationMessageElement(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('formly-validation-message');
}

describe('FormlyValidationMessage Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot({
          validationMessages: [
            { name: 'required', message: (err, field) => `${field.templateOptions.label} is required.`},
            { name: 'maxlength', message: 'Maximum Length Exceeded.' },
            { name: 'minlength', message: () => of('Minimum Length.') },
          ],
        }),
      ],
    });
  });

  it('should not display message error when form is valid', () => {
    const fixture = createTestComponent('<formly-validation-message [field]="field"></formly-validation-message>');
    const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
    fixture.componentInstance.field.formControl.setValue('12');
    fixture.detectChanges();

    expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
    expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
  });

  describe('display message error when form is invalid', () => {
    it('with a simple validation message', () => {
      const fixture = createTestComponent('<formly-validation-message [field]="field"></formly-validation-message>');
      const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
      fixture.componentInstance.field.formControl.setValue('test');
      fixture.detectChanges();

      expect(formlyMessageElm.textContent).toMatch(/Maximum Length Exceeded/);
      expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
    });

    it('with a function validation message', () => {
      const fixture = createTestComponent('<formly-validation-message [field]="field"></formly-validation-message>');
      const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);

      expect(formlyMessageElm.textContent).toMatch(/Title is required/);
      expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
    });

    it('with an observable validation message', () => {
      const fixture = createTestComponent('<formly-validation-message [field]="field"></formly-validation-message>');
      const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
      fixture.componentInstance.field.formControl.setValue('v');
      fixture.detectChanges();
      expect(formlyMessageElm.textContent).toMatch(/Minimum Length/);
    });

    it('with a `validator.message` property', () => {
      const fixture = createTestComponent('<formly-validation-message [field]="field"></formly-validation-message>');
      const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
      fixture.componentInstance.field = Object.assign({}, fixture.componentInstance.field, {
        validators: {
          required: {
            expression: (control: FormControl) => false,
            message: `Custom title: Should have at least 3 Characters`,
          },
        },
      });

      fixture.detectChanges();

      expect(formlyMessageElm.textContent).toMatch(/Custom title: Should have at least 3 Characters/);
      expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
      expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
    });

    it('should handle expressionProperties changes', () => {
      const fixture = createTestComponent('<formly-validation-message [field]="field"></formly-validation-message>');
      const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
      const options = { fieldChanges: new Subject<any>() };
      fixture.componentInstance.field = Object.assign({}, fixture.componentInstance.field, {
        options,
        validation: { messages: { required: 'field required' } },
      });

      fixture.detectChanges();
      expect(formlyMessageElm.textContent).toMatch(/field required/);

      // without emit expressionChanges
      fixture.componentInstance.field.validation.messages.required = 'edited required message';
      fixture.detectChanges();
      expect(formlyMessageElm.textContent).not.toMatch(/edited required message/);

      // emit expressionChanges from a different field
      options.fieldChanges.next({
        type: 'expressionChanges',
        property: 'validation.messages.required',
        field: {},
      });
      expect(formlyMessageElm.textContent).not.toMatch(/edited required message/);

      // emit expressionChanges from component field
      options.fieldChanges.next({
        type: 'expressionChanges',
        property: 'validation.messages.required',
        field: fixture.componentInstance.field,
        value: 'edit required message',
      });
      expect(formlyMessageElm.textContent).not.toMatch(/edited required message/);
    });
  });

});

@Component({selector: 'formly-validation-message-test', template: '', entryComponents: []})
class TestComponent {
  field: FormlyFieldConfig = {
    type: 'input',
    formControl: new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.minLength(2)]),
    key: 'title',
    templateOptions: {
      label: 'Title',
    },
  };
}
