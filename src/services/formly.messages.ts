import {Inject, Component, Input, Injectable} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {FORMLY_CONFIG_TOKEN} from "./formly.config";

@Injectable()
export class FormlyMessages {
  messages = {};

  constructor(@Inject(FORMLY_CONFIG_TOKEN) configs) {
    configs.map(config => {
      if (config.validationMessages) {
        config.validationMessages.map(validation => this.addStringMessage(validation.name, validation.message));
      }
    });
  }

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
  template: `<div *ngIf="errorMessage">{{errorMessage}}</div>`
})
export class FormlyMessage {
  @Input() controlName: string;
  @Input() form: FormGroup;

  constructor(private formlyMessages: FormlyMessages) {}

  get errorMessage() {
    let formControl = this.form.get(this.controlName);

    for (let propertyName in formControl.errors) {
      if (formControl.errors.hasOwnProperty(propertyName)) {
        return this.formlyMessages.getValidatorErrorMessage(propertyName);
      }
    }
  }
}
