
import {Component, AfterViewInit, ElementRef} from "angular2/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
  selector: 'formly-field-textarea',
  templateUrl: 'src/templates/textarea.html'
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