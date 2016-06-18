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
          <input type="checkbox" [ngControl]="key" (change)="inputChange($event, 'checked')" [(ngModel)]="model"
            *ngIf="!templateOptions.hidden" [disabled]="templateOptions.disabled" value="on"> {{templateOptions.label}}
            <span class="c-indicator"></span>
          </label>
      </div>
      <small class="text-muted">{{templateOptions.description}}</small>
    </div>
    `,
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "model"]
})
export class FormlyFieldCheckbox extends Field {

  constructor(fm: FormlyMessages, ps: FormlyPubSub, private formBuilder: FormBuilder) {
    super(fm, ps);
  }

  createControl(): AbstractControl {
    return this._control = this.formBuilder.control(this._model ? "on" : undefined);
  }

}
