
import {Component, AfterViewInit, ElementRef} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
  selector: "formly-field-textarea",
  template: `
    <fieldset class="form-group" [ngFormModel]="form">
      <label attr.for="{{key}}">{{templateOptions.label}}</label>
      <textarea name="{{key}}" [ngControl]="key" id="{{key}}" cols="{{templateOptions.cols}}" rows="{{templateOptions.rows}}" (change)="inputChange($event, 'value')" (keyup)="inputChange($event, 'value')" placeholder="{{templateOptions.placeholder}}" class="form-control"></textarea>
      <small class="text-muted">{{templateOptions.description}}</small>
    </fieldset>`
})
export class FormlyFieldTextArea extends Field implements AfterViewInit {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, private  elem: ElementRef) {
    super(fm, ps);
  }
  ngAfterViewInit() {
    if (this.templateOptions.focus) {
      this.elem.nativeElement.querySelector("textarea").focus();
    }
  }
}
