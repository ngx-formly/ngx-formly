import {Component, ElementRef, OnInit, AfterContentInit, AfterViewInit} from "angular2/core";
import {FormlyMessages, FormlyMessage} from "./../services/formly.messages";
import {FormlyPubSub} from "./../services/formly.event.emitter";
import { Field } from "./field";

@Component({
  selector: "formly-field-input",
  template: `
        <div class="form-group" [ngFormModel]="form" [ngClass]="{'has-danger': !form.controls[key].valid}">
            <label attr.for="{{key}}" class="form-control-label">{{options.label}}</label>
            <input type="{{options.type}}" [ngControl]="key" class="form-control" id="{{key}}" placeholder="{{options.placeholder}}" [disabled]="options.disabled" (keyup)="inputChange($event, 'value')" (change)="inputChange($event, 'value')" *ngIf="!options.hidden" [ngClass]="{'form-control-danger': !form.controls[key].valid}">
            <small class="text-muted">{{options.description}}</small>
            <small class="text-muted text-danger"><formly-message [control]="key"></formly-message></small>
        </div>
    `,
  directives: [FormlyMessage]
})
export class FormlyFieldInput extends Field implements AfterViewInit {


  constructor(fm: FormlyMessages, ps: FormlyPubSub, private elem: ElementRef) {
    super(fm, ps);
  }
  ngAfterViewInit() {
    if (this.options.focus) {
      this.elem.nativeElement.querySelector("input").focus();
    }
  }
}
