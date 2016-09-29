import {Component} from "@angular/core";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-radio",
  template: `
    <div [formGroup]="form">
      <div class="form-group">
        <label class="form-control-label" for="">{{templateOptions.label}}</label>
        <div *ngFor="let option of templateOptions.options" class="radio">
          <label class="custom-control custom-radio">
            <input type="radio" [value]="option.key" [formControlName]="key"
            [formlyNgFocus]="focus" (focus)="onInputFocus()" class="custom-control-input">
            {{option.value}}
            <span class="custom-control-indicator"></span>
          </label>
        </div>
        <small class="text-muted">{{templateOptions.description}}</small>
      </div>
    </div>`,
})
export class FormlyFieldRadio extends Field {
  constructor(focusDispatcher: SingleFocusDispatcher) {
    super(focusDispatcher);
  }
}
