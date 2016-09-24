import {Component, Input, Injectable} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Injectable()
export class FormlyMessages {
  messages = {};

  addStringMessage(validator, message) {
    this.messages[validator] = message;
  }

  getMessages() {
    return this.messages;
  }

  getValidatorErrorMessage(prop) {
    return this.messages[prop];
  }
}

@Component({
  selector: "formly-message",
  template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class FormlyMessage {
  @Input() formControlName: string;
  @Input() formGroup: FormGroup;

  constructor(protected fm: FormlyMessages) { }

  get errorMessage() {
    let formControl = this.formGroup.get(this.formControlName);

    for (let propertyName in formControl.errors) {
      if (formControl.errors.hasOwnProperty(propertyName)) {
        return this.fm.getValidatorErrorMessage(propertyName);
      }
    }

    return null;
  }
}
