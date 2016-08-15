
import {Component, AfterViewInit, ElementRef, Renderer, QueryList, ViewChildren} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-textarea",
  template: `
    <fieldset class="form-group" [formGroup]="form" *ngIf="!templateOptions.hidden">
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
      <textarea name="{{key}}" [formControlName]="key" id="{{key}}" [(ngModel)]="model" cols="{{templateOptions.cols}}"
        rows="{{templateOptions.rows}}" (change)="inputChange($event, 'value')" (keyup)="inputChange($event, 'value')"
        placeholder="{{templateOptions.placeholder}}" class="form-control" [disabled]="templateOptions.disabled"
        (focus)="onInputFocus()" #textAreaElement>
        
      </textarea>
      <small class="text-muted">{{templateOptions.description}}</small>
    </fieldset>`,
  queries: {inputComponent: new ViewChildren("textAreaElement")},
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class FormlyFieldTextArea extends Field implements AfterViewInit {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, renderer: Renderer, focusDispatcher: SingleFocusDispatcher) {
    super(fm, ps, renderer, focusDispatcher);
  }

  inputComponent: QueryList<ElementRef>;

  protected setNativeFocusProperty(newFocusValue: boolean): void {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", [newFocusValue]);
    }
  }
}
