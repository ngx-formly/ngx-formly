import {Component} from "@angular/core";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-input",
  template: `
    <div class="form-group" [formGroup]="form" [ngClass]="{'has-danger': valid}" *ngIf="!templateOptions.hidden">
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
        <input [type]="templateOptions.type" [formControlName]="key" class="form-control" id="{{key}}"
          [placeholder]="templateOptions.placeholder"
          [formlyNgFocus]="focus" (focus)="onInputFocus()" [ngClass]="{'form-control-danger': valid}">
        <small class="text-muted">{{templateOptions.description}}</small>
        <small class="text-muted text-danger" *ngIf="valid"><formly-message [form]="form" [controlName]="key"></formly-message></small>
      </div>
    `,
})
export class FormlyFieldInput extends Field {
  constructor(focusDispatcher: SingleFocusDispatcher) {
    super(focusDispatcher);
  }

  get valid() {
    return this.formControl.touched && !this.formControl.valid;
  }
}
