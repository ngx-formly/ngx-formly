import {Component, ElementRef, AfterViewInit, Renderer, ViewChildren, QueryList} from "@angular/core";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-input",
  template: `
    <div class="form-group" [formGroup]="form" [ngClass]="{'has-danger': formControl.touched && !formControl.valid}" *ngIf="!templateOptions.hidden">
      <label attr.for="{{key}}" class="form-control-label">{{templateOptions.label}}</label>
        <input [type]="templateOptions.type" [formControlName]="key" class="form-control" id="{{key}}"
          [placeholder]="templateOptions.placeholder"
          (focus)="onInputFocus()" [ngClass]="{'form-control-danger': !form.controls[key].valid}" #inputElement>
        <small class="text-muted">{{templateOptions.description}}</small>
        <small class="text-muted text-danger" *ngIf="formControl.touched && !formControl.valid"><formly-message [form]="form" [controlName]="key"></formly-message></small>
      </div>
    `,
  queries: {inputComponent: new ViewChildren("inputElement")}
})
export class FormlyFieldInput extends Field implements AfterViewInit {
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
