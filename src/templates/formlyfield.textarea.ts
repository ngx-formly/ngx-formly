import {Component, AfterViewInit, ElementRef, Renderer, QueryList, ViewChildren} from "@angular/core";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-textarea",
  template: `
    <fieldset class="form-group" [formGroup]="form" *ngIf="!templateOptions.hidden">
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
      <textarea name="{{key}}" [formControlName]="key" id="{{key}}" cols="{{templateOptions.cols}}"
        rows="{{templateOptions.rows}}" [placeholder]="templateOptions.placeholder" class="form-control"
        (focus)="onInputFocus()" #textAreaElement>
      </textarea>
      <small class="text-muted">{{templateOptions.description}}</small>
    </fieldset>`,
  queries: {inputComponent: new ViewChildren("textAreaElement")},
})
export class FormlyFieldTextArea extends Field implements AfterViewInit {
  inputComponent: QueryList<ElementRef>;

  constructor(renderer: Renderer, focusDispatcher: SingleFocusDispatcher) {
    super(renderer, focusDispatcher);
  }

  protected setNativeFocusProperty(newFocusValue: boolean): void {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", [newFocusValue]);
    }
  }
}
