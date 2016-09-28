import {Component, AfterViewInit} from "@angular/core";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-textarea",
  template: `
    <fieldset class="form-group" [formGroup]="form" *ngIf="!templateOptions.hidden">
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
      <textarea name="{{key}}" [formControlName]="key" id="{{key}}" cols="{{templateOptions.cols}}"
        rows="{{templateOptions.rows}}" [placeholder]="templateOptions.placeholder" class="form-control"
        (focus)="onInputFocus()">
      </textarea>
      <small class="text-muted">{{templateOptions.description}}</small>
    </fieldset>`,
})
export class FormlyFieldTextArea extends Field implements AfterViewInit {
  constructor(focusDispatcher: SingleFocusDispatcher) {
    super(focusDispatcher);
  }
}
