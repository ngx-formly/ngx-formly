
import {Component, Renderer, QueryList, ElementRef, ViewChildren} from "@angular/core";
import {FormlyPubSub, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {FormBuilder, AbstractControl} from "@angular/forms";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-multicheckbox",
  template: `
        <div [formGroup]="form">
            <div [formGroupName]="key" class="form-group">
                <label class="form-control-label" for="">{{templateOptions.label}}</label>
                <div *ngFor="let option of templateOptions.options" class="checkbox">
                    <label class="custom-control custom-checkbox">
                        <input type="checkbox" name="choose" value="{{option.value}}" [formControlName]="option.key"
                          [(ngModel)]="model[option.key]" (change)="inputChange($event, option.key)"
                          (focus)="onInputFocus()" class="custom-control-input"
                          [disabled]="templateOptions.disabled">{{option.value}}
                        <span class="custom-control-indicator"></span>
                    </label>
                </div>
                <small class="text-muted">{{templateOptions.description}}</small>
            </div>
        </div>
    `,
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  queries: {inputComponent: new ViewChildren("textAreaElement")}
})
export class FormlyFieldMultiCheckbox extends Field {

  constructor(fm: FormlyMessages, private fps: FormlyPubSub, private formBuilder: FormBuilder, renderer: Renderer,
              focusDispatcher: SingleFocusDispatcher) {
    super(fm, fps, renderer, focusDispatcher);
  }

  inputChange(e, val) {
    this._model[val] = e.target.checked;
    this.changeFn.emit(new FormlyValueChangeEvent(this.key, this._model));
    this.fps.setUpdated(true);
  }

  createControl(): AbstractControl {
    let controlGroupConfig = this.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = [this._model ? this._model[option.key] : undefined];
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
