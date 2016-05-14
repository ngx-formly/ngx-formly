import {Component} from "@angular/core";
import { Field } from "./field";
import {FormlyMessages} from "./../services/formly.messages";
import {FormlyPubSub} from "./../services/formly.event.emitter";

@Component({
  selector: "formly-field-checkbox",
  template: `
      <div class="form-group">
          <div [ngFormModel]="form">
              <label class="c-input c-checkbox">
                  <input type="checkbox" [ngControl]="key" (change)="inputChange($event, 'checked')" value="on"> {{options.label}}
                  <span class="c-indicator"></span>
              </label>
          </div>
          <small class="text-muted">{{options.description}}</small>
      </div>
    `
})
export class FormlyFieldCheckbox extends Field {

  constructor(fm: FormlyMessages, ps: FormlyPubSub) {
    super(fm, ps);
  }

}
