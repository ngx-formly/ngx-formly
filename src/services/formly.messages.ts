import {Injectable}   from "angular2/core";
import {Component, Host, Input} from "angular2/core";
import {NgFormModel} from "angular2/common";

@Injectable()
export class FormlyMessages {
  messages = {};
  constructor() { }
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
  @Input() control: string;

  constructor(@Host() private _formDir: NgFormModel, protected fm: FormlyMessages) { }


  get errorMessage() {
    let c = this._formDir.form.find(this.control);

    for (let propertyName in c.errors) {
      if (c.errors.hasOwnProperty(propertyName)) {
        return this.fm.getValidatorErrorMessage(propertyName);
      }
    }

    return null;
  }
}
