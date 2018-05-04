import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test-utils';

import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '../core';

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

    it('with a validator.message property', () => {
      const fixture = createTestComponent('<formly-validation-message [field]="field"></formly-validation-message>');
      const formlyMessageElm = getFormlyValidationMessageElement(fixture.nativeElement);
      fixture.componentInstance.field = Object.assign({}, fixture.componentInstance.field, {
        validators: {
          required: {
            expression: (control: FormControl) => false,
            message: `Custom title: Should have atleast 3 Characters`,
          },
        },
      });

      fixture.detectChanges();

      expect(formlyMessageElm.textContent).toMatch(/Custom title: Should have atleast 3 Characters/);
      expect(formlyMessageElm.textContent).not.toMatch(/Maximum Length Exceeded/);
      expect(formlyMessageElm.textContent).not.toMatch(/Title is required/);
    });
  });

});

@Component({selector: 'formly-validation-message-test', template: '', entryComponents: []})
class TestComponent {
  field: FormlyFieldConfig = {
    type: 'input',
    formControl: new FormControl(null, [Validators.required, Validators.maxLength(3)]),
    key: 'title',
    templateOptions: {
      label: 'Title',
    },
  };
}
