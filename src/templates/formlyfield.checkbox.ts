import {Component} from "@angular/core";
import { Field } from "./field";
import {FormlyMessages} from "./../services/formly.messages";
import {FormlyPubSub} from "./../services/formly.event.emitter";
import {AbstractControl, FormBuilder} from "@angular/common";

@Component({
  selector: "formly-field-checkbox",
  template: `
    <div class="form-group">
      <div [ngFormModel]="form">
        <label class="c-input c-checkbox">
          <input type="checkbox" [ngControl]="key" (change)="inputChange($event, 'checked')"
            *ngIf="!templateOptions.hidden" [disabled]="templateOptions.disabled" value="on"> {{templateOptions.label}}
            <span class="c-indicator"></span>
          </label>
      </div>
      <small class="text-muted">{{templateOptions.description}}</small>
    </div>
    `
})
export class FormlyFieldCheckbox extends Field {

  constructor(fm: FormlyMessages, ps: FormlyPubSub, private formBuilder: FormBuilder) {
    super(fm, ps);
  }

  createControl(): AbstractControl {
    return this.formBuilder.control(this.model[this.key] ? "on" : undefined);
  }

}
