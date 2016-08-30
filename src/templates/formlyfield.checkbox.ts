import {Component, Renderer, ElementRef, ViewChildren, QueryList} from "@angular/core";
import {Field} from "./field";
import {FormlyMessages} from "./../services/formly.messages";
import {FormlyPubSub} from "./../services/formly.event.emitter";
import {AbstractControl, FormBuilder} from "@angular/forms";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-checkbox",
  template: `
    <div class="form-group">
      <div [formGroup]="form" class="checkbox">
        <label class="custom-control custom-checkbox">
          <input type="checkbox" [formControlName]="key" (change)="inputChange($event, 'checked')" [(ngModel)]="model"
            *ngIf="!templateOptions.hidden" [disabled]="templateOptions.disabled" value="on"
            #inputElement class="custom-control-input">
            {{templateOptions.label}}
            <span class="custom-control-indicator"></span>
          </label>
      </div>
      <small class="text-muted">{{templateOptions.description}}</small>
    </div>
    `,
  queries: {inputComponent: new ViewChildren("inputElement")}
})
export class FormlyFieldCheckbox extends Field {

  constructor(fm: FormlyMessages, ps: FormlyPubSub, private formBuilder: FormBuilder, renderer: Renderer,
              focusDispatcher: SingleFocusDispatcher) {
    super(fm, ps, renderer, focusDispatcher);
  }

  inputComponent: QueryList<ElementRef>;

  createControl(): AbstractControl {
    return this._control = this.formBuilder.control(this._model ? "on" : undefined);
  }

  protected setNativeFocusProperty(newFocusValue: boolean): void {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", [newFocusValue]);
    }
  }

}
