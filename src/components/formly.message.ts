import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '../components/formly.field.config';
import { FormlyMessages } from '../services/formly.messages';

@Component({
  selector: 'formly-message',
  template: `<div *ngIf="errorMessage">{{errorMessage}}</div>`,
})
export class FormlyMessage {
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;

  constructor(private formlyMessages: FormlyMessages) {}

  get errorMessage() {
    let formControl = this.form.get(this.controlName);
    for (let propertyName in formControl.errors) {
      if (formControl.errors.hasOwnProperty(propertyName)) {
        let message = this.formlyMessages.getValidatorErrorMessage(propertyName);
        if (typeof message === 'function') {
          return message(formControl.errors[propertyName], this.field);
        }
        return message;
      }
    }
  }
}
