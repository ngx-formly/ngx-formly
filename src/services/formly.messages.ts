import { Inject, Injectable } from '@angular/core';
import { FORMLY_CONFIG_TOKEN } from './formly.config';

@Injectable()
export class FormlyMessages {
  messages = {};

  constructor(@Inject(FORMLY_CONFIG_TOKEN) configs = []) {
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
