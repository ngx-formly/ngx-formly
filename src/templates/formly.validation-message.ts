import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '../components/formly.field.config';
import { FormlyValidationMessages } from '../services/formly.validation-messages';

@Component({
  selector: 'formly-validation-message',
  template: `{{errorMessage}}`,
})
export class FormlyValidationMessage {
  @Input() fieldForm: FormControl;
  @Input() field: FormlyFieldConfig;

  constructor(private formlyMessages: FormlyValidationMessages) {}

  get errorMessage() {
    for (let error in this.fieldForm.errors) {
      if (this.fieldForm.errors.hasOwnProperty(error)) {
        let message = this.formlyMessages.getValidatorErrorMessage(error);
        if (typeof message === 'function') {
          return message(this.fieldForm.errors[error], this.field);
        }

        return message;
      }
    }
  }
}
