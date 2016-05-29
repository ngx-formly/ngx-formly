
import {Component} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {RadioButtonState, Control, ControlGroup, AbstractControl, FormBuilder} from "@angular/common";

@Component({
  selector: "formly-field-radio",
  template: `
    <div [ngFormModel]="form">
      <div [ngControlGroup]="key" class="form-group">
        <label class="form-control-label" for="">{{templateOptions.label}}</label>
        <div *ngFor="let option of templateOptions.options">
          <label class="c-input c-radio">
            <input type="radio" name="choose" value="{{option.value}}" [ngControl]="option.key" [(ngModel)]="viewModel[option.key]"
              (change)="inputChange($event, 'value')">{{option.value}}
            <span class="c-indicator"></span>
          </label>
        </div>
        <small class="text-muted">{{templateOptions.description}}</small>
      </div>
    </div>`,
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "viewModel"]
})
export class FormlyFieldRadio extends Field {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, private formBuilder: FormBuilder) {
    super(fm, ps);
  }

  createControl(): AbstractControl {
    let controlGroupConfig = this.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = [new RadioButtonState(this._viewModel === option.value , option.value)];
      return previous;
    }, {});
    return this.formBuilder.group(controlGroupConfig);
  }
}
