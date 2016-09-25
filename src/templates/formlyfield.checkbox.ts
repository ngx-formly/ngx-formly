import {Component, Renderer, ElementRef, ViewChildren, QueryList} from "@angular/core";
import {AbstractControl, FormBuilder} from "@angular/forms";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-checkbox",
  template: `
    <div class="form-group">
      <div [formGroup]="form" class="checkbox">
        <label class="custom-control custom-checkbox">
          <input type="checkbox" [formControlName]="key"
            *ngIf="!templateOptions.hidden" value="on"
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
  inputComponent: QueryList<ElementRef>;

  constructor(
    renderer: Renderer,
    focusDispatcher: SingleFocusDispatcher,
    private formBuilder: FormBuilder,
  ) {
    super(renderer, focusDispatcher);
  }

  createControl(): AbstractControl {
    return this._control = this.formBuilder.control(this.model ? "on" : undefined);
  }

  protected setNativeFocusProperty(newFocusValue: boolean): void {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", [newFocusValue]);
    }
  }

}
