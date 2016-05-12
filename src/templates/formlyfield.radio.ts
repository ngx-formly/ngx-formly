
import {Component} from "angular2/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
  selector: "formly-field-radio",
  template: `
        <div [ngFormModel]="form">
            <div [ngControlGroup]="key" class="form-group">
                <label class="form-control-label" for="">{{options.label}}</label>
                <div *ngFor="let option of options.options">
                    <label class="c-input c-radio">
                        <input type="radio" name="choose" value="{{option.value}}" [ngControl]="option.key" (change)="inputChange($event, 'value')">{{option.value}}
                        <span class="c-indicator"></span>
                    </label>
                </div>
                <small class="text-muted">{{options.description}}</small>
            </div>
        </div>
    `
})
export class FormlyFieldRadio extends Field {
  constructor(fm: FormlyMessages, ps: FormlyPubSub) {
    super(fm, ps);
  }
}
