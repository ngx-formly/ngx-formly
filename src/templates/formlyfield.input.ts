import {Component, ElementRef, AfterViewInit} from "@angular/core";
import {FormlyMessages, FormlyMessage} from "./../services/formly.messages";
import {FormlyPubSub} from "./../services/formly.event.emitter";
import { Field } from "./field";

@Component({
  selector: "formly-field-input",
  template: `
    <div class="form-group" [ngFormModel]="form" [ngClass]="{'has-danger': !formControl.valid}" *ngIf="!templateOptions.hidden">
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
        <input type="{{templateOptions.type}}" [ngControl]="key" class="form-control" id="{{key}}"
          placeholder="{{templateOptions.placeholder}}" [disabled]="templateOptions.disabled"
          (keyup)="inputChange($event, 'value')" (change)="inputChange($event, 'value')" [(ngModel)]="viewModel"
          [ngClass]="{'form-control-danger': !form.controls[key].valid}">
        <small class="text-muted">{{templateOptions.description}}</small>
        <small class="text-muted text-danger"><formly-message [control]="key"></formly-message></small>
      </div>
    `,
  directives: [FormlyMessage],
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "viewModel"]
})
export class FormlyFieldInput extends Field implements AfterViewInit {


  constructor(fm: FormlyMessages, ps: FormlyPubSub, private elem: ElementRef) {
    super(fm, ps);
  }
  ngAfterViewInit() {
    if (this.templateOptions.focus) {
      this.elem.nativeElement.querySelector("input").focus();
    }
  }
}
