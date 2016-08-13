
import {Component, Renderer, QueryList, ElementRef, ViewChildren} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {AbstractControl, FormBuilder, REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES} from "@angular/forms";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-radio",
  template: `
    <div [formGroup]="form">
      <div [formGroupName]="key" class="form-group">
        <label class="form-control-label" for="">{{templateOptions.label}}</label>
        <div *ngFor="let option of templateOptions.options">
          <label class="c-input c-radio">
            <input type="radio" value="{{option.key}}" [formControlName]="option.key"
            [checked] = "model === option.key" (change)="inputChange($event, 'value')" (focus)="onInputFocus()"
            [disabled]="templateOptions.disabled">{{option.value}}
            <span class="c-indicator"></span>
          </label>
        </div>
        <small class="text-muted">{{templateOptions.description}}</small>
      </div>
    </div>`,
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "model"],
  directives: [REACTIVE_FORM_DIRECTIVES, FORM_DIRECTIVES],
  queries: {inputComponent: new ViewChildren("inputElement")}
})
export class FormlyFieldRadio extends Field {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, private formBuilder: FormBuilder, renderer: Renderer,
              focusDispatcher: SingleFocusDispatcher) {
    super(fm, ps, renderer, focusDispatcher);
  }

  createControl(): AbstractControl {
    let controlGroupConfig = this.templateOptions.options.reduce((previous, option) => {
      // previous[option.key] = [new RadioButtonState(this._model === option.value , option.key)];
      previous[option.key] = [];
      return previous;
    }, {});
    return this._control = this.formBuilder.group(controlGroupConfig);
  }

  inputComponent: QueryList<ElementRef>;

  protected setNativeFocusProperty(newFocusValue: boolean): void {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", [newFocusValue]);
    }
  }
}
