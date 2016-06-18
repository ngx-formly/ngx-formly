
import {Component} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {RadioButtonState, AbstractControl, FormBuilder} from "@angular/common";

@Component({
  selector: "formly-field-radio",
  template: `
    <div [ngFormModel]="form">
      <div [ngControlGroup]="key" class="form-group">
        <label class="form-control-label" for="">{{templateOptions.label}}</label>
        <div *ngFor="let option of templateOptions.options">
          <label class="c-input c-radio">
            <input type="radio" name="choose" value="{{option.key}}" [ngControl]="option.key"
            [checked] = "model === option.key" (change)="inputChange($event, 'value')">{{option.value}}
            <span class="c-indicator"></span>
          </label>
        </div>
        <small class="text-muted">{{templateOptions.description}}</small>
      </div>
    </div>`,
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "model"]
})
export class FormlyFieldRadio extends Field {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, private formBuilder: FormBuilder) {
    super(fm, ps);
  }

  createControl(): AbstractControl {
    let controlGroupConfig = this.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = [new RadioButtonState(this._model === option.value , option.key)];
      return previous;
    }, {});
    return this._control = this.formBuilder.group(controlGroupConfig);
  }
}
