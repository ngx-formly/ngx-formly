
import {Component, AfterViewInit, ElementRef} from "angular2/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
  selector: 'formly-field-textarea',
  template: `
    <fieldset class="form-group" [ngFormModel]="form">
        <label attr.for="{{key}}">{{options.label}}</label>
        <textarea name="{{key}}" [ngControl]="key" id="{{key}}" cols="{{options.cols}}" rows="{{options.rows}}" (change)="inputChange($event, 'value')" (keyup)="inputChange($event, 'value')" placeholder="{{options.placeholder}}" class="form-control"></textarea>
        <small class="text-muted">{{options.description}}</small>
    </fieldset>`
})
export class FormlyFieldTextArea extends Field implements AfterViewInit{
  constructor(fm: FormlyMessages, ps:FormlyPubSub, private  elem: ElementRef) {
    super(fm, ps);
  }
  ngAfterViewInit() {
    if(this.options.focus) {
      this.elem.nativeElement.querySelector('textarea').focus();
    }
  }
}