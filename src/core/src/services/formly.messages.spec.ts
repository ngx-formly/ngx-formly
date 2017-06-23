import { FormlyValidationMessages } from './formly.validation-messages';

describe('FormlyValidationMessages service', () => {
  let formlyMessages: FormlyValidationMessages;
  beforeEach(() => {
    formlyMessages = new FormlyValidationMessages([{
      validationMessages: [
        { name: 'required', message: 'This field is required.' },
      ],
    }]);
  });

  it('get validator error message', () => {
    expect(formlyMessages.getValidatorErrorMessage('required')).toEqual('This field is required.');
    expect(formlyMessages.getValidatorErrorMessage('maxlength')).toEqual(undefined);
  });

  it('add validator error message', () => {
    formlyMessages.addStringMessage('maxlength', 'Maximum Length Exceeded.');
    expect(formlyMessages.getValidatorErrorMessage('maxlength')).toEqual('Maximum Length Exceeded.');
  });
});
