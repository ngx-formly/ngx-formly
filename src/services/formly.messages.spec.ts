import { FormlyMessages } from './formly.messages';

describe('FormlyMessages service', () => {
  let formlyMessages: FormlyMessages;
  beforeEach(() => {
    formlyMessages = new FormlyMessages([{
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
