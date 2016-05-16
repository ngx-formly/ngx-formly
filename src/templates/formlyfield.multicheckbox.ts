
import {Component, Input} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {FormBuilder, AbstractControl} from "@angular/common";

@Component({
  selector: "formly-field-multicheckbox",
  template: `
        <div [ngFormModel]="form">
            <div [ngControlGroup]="key" class="form-group">
                <label class="form-control-label" for="">{{templateOptions.label}}</label>
                <div *ngFor="let option of templateOptions.options">
                    <label class="c-input c-radio">
                        <input type="checkbox" name="choose" value="{{option.value}}" [ngControl]="option.key" (change)="inputChange($event, option.key)">{{option.value}}
                        <span class="c-indicator"></span>
                    </label>
                </div>
                <small class="text-muted">{{templateOptions.description}}</small>
            </div>
        </div>
    `
})
export class FormlyFieldMultiCheckbox extends Field {

  @Input() model: Object;

  constructor(fm: FormlyMessages, private fps: FormlyPubSub, private formBuilder: FormBuilder) {
    super(fm, fps);
  }

  inputChange(e, val) {
    this.model[val] = e.target.checked;
    this.changeFn.emit(this.model);
    this.fps.setUpdated(true);
  }

  createControl(): AbstractControl {
    let controlGroupConfig = this.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = [this.model ? this.model[option.key] : undefined];
      return previous;
    }, {});
    return this.formBuilder.group(controlGroupConfig);
  }
}
