import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { FormlyModule, FormlyFieldConfig } from '../core';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';

function validationMessageContent(query: (v: string) => DebugElement): string {
  return query('formly-validation-message').nativeElement.textContent;
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
    const { query } = renderComponent({ key: 'title' });

    expect(validationMessageContent(query)).toEqual('');
  });

  describe('display message error when form is invalid', () => {
    it('with a string validation message', () => {
      const { query } = renderComponent({
        key: 'title',
        defaultValue: '1234567',
        templateOptions: { maxLength: 3 },
      });
      expect(validationMessageContent(query)).toEqual('Maximum Length Exceeded.');
    });

    it('with a function validation message', () => {
      const { query, detectChanges } = renderComponent({
        key: 'title',
        templateOptions: {
          required: true,
          label: 'Title',
        },
      });
      detectChanges();
      expect(validationMessageContent(query)).toEqual('Title is required.');
    });

    it('with an observable validation message', () => {
      const { query, detectChanges } = renderComponent({
        key: 'title',
        defaultValue: '1',
        templateOptions: { minLength: 5 },
      });
      detectChanges();
      expect(validationMessageContent(query)).toEqual('Minimum Length.');
    });

    it('with a `validator.message` property', () => {
      const { query } = renderComponent({
        key: 'title',
        validators: {
          required: {
            expression: () => false,
            message: 'Custom error message.',
          },
        },
      });

      expect(validationMessageContent(query)).toEqual('Custom error message.');
    });
  });
});
