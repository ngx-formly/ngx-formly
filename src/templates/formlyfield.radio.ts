import {Component, Renderer, QueryList, ElementRef, ViewChildren} from "@angular/core";
import {FormlyPubSub, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-radio",
  template: `
    <div [formGroup]="form">
      <div class="form-group">
        <label class="form-control-label" for="">{{templateOptions.label}}</label>
        <div *ngFor="let option of templateOptions.options">
          <label class="c-input c-radio">
            <input type="radio" [value]="option.key" [formControlName]="key" [(ngModel)]="model"
            (change)="inputChange($event, option.key)" (focus)="onInputFocus()"
            [disabled]="templateOptions.disabled">{{option.value}}
            <span class="c-indicator"></span>
          </label>
        </div>
        <small class="text-muted">{{templateOptions.description}}</small>
      </div>
    </div>`,
  queries: {inputComponent: new ViewChildren("inputElement")}
})
export class FormlyFieldRadio extends Field {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, renderer: Renderer,
              focusDispatcher: SingleFocusDispatcher) {
    super(fm, ps, renderer, focusDispatcher);
  }

  inputComponent: QueryList<ElementRef>;

  protected setNativeFocusProperty(newFocusValue: boolean): void {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", [newFocusValue]);
    }
  }

  inputChange(e, val) {
    this.model = val;
    this.changeFn.emit(new FormlyValueChangeEvent(this.key, this.model));
    this.ps.setUpdated(true);
  }
}
