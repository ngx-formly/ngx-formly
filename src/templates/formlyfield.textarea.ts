
import {Component, AfterViewInit, ElementRef, Renderer, QueryList, ViewChildren} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
  selector: "formly-field-textarea",
  template: `
    <fieldset class="form-group" [ngFormModel]="form" *ngIf="!templateOptions.hidden">
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
      <textarea name="{{key}}" [ngControl]="key" id="{{key}}" [(ngModel)]="model" cols="{{templateOptions.cols}}"
        rows="{{templateOptions.rows}}" (change)="inputChange($event, 'value')" (keyup)="inputChange($event, 'value')"
        placeholder="{{templateOptions.placeholder}}" class="form-control" [disabled]="templateOptions.disabled"
        #textAreaElement></textarea>
      <small class="text-muted">{{templateOptions.description}}</small>
    </fieldset>`,
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "model"],
  queries: {inputComponent: new ViewChildren("textAreaElement")}
})
export class FormlyFieldTextArea extends Field implements AfterViewInit {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, renderer: Renderer) {
    super(fm, ps, renderer);
  }

  inputComponent: QueryList<ElementRef>;

  public set focus (value: boolean) {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", []);
    }
    this._focus = value;
  }
}
