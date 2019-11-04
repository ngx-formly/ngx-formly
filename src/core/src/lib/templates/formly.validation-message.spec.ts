import { ComponentFixture } from '@angular/core/testing';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyModule, FormlyFieldConfig } from '../core';
import { of } from 'rxjs';

function getFieldValidationMessage(fixture: ComponentFixture<any>): string {
  return fixture.nativeElement.querySelector('formly-validation-message').textContent;
}

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    template: '<formly-validation-message [field]="field"></formly-validation-message>',
    imports: [
      FormlyModule.forChild({
        validationMessages: [
          { name: 'required', message: (err, field) => `${field.templateOptions.label} is required.` },
          { name: 'maxlength', message: 'Maximum Length Exceeded.' },
          { name: 'minlength', message: () => of('Minimum Length.') },
        ],
      }),
    ],
  });
};

describe('FormlyValidationMessage Component', () => {
  it('should not display message error when form is valid', () => {
    const fixture = renderComponent({ key: 'title' });

    expect(getFieldValidationMessage(fixture)).toEqual('');
  });

  describe('display message error when form is invalid', () => {
    it('with a string validation message', () => {
      const fixture = renderComponent({
        key: 'title',
        defaultValue: '1234567',
        templateOptions: { maxLength: 3 },
      });
      expect(getFieldValidationMessage(fixture)).toEqual('Maximum Length Exceeded.');
    });

    it('with a function validation message', () => {
      const fixture = renderComponent({
        key: 'title',
        templateOptions: {
          required: true,
          label: 'Title',
        },
      });
      fixture.detectChanges();
      expect(getFieldValidationMessage(fixture)).toEqual('Title is required.');
    });

    it('with an observable validation message', () => {
      const fixture = renderComponent({
        key: 'title',
        defaultValue: '1',
        templateOptions: { minLength: 5 },
      });
      fixture.detectChanges();
      expect(getFieldValidationMessage(fixture)).toEqual('Minimum Length.');
    });

    it('with a `validator.message` property', () => {
      const fixture = renderComponent({
        key: 'title',
        validators: {
          required: {
            expression: () => false,
            message: 'Custom error message.',
          },
        },
      });

      expect(getFieldValidationMessage(fixture)).toEqual('Custom error message.');
    });
  });
});
