
import {Component, Renderer, QueryList, ViewChildren, ElementRef} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

@Component({
  selector: "formly-field-select",
  template: `
        <div class="select form-group" [formGroup]="form">
          <label for="" class="form-control-label">{{templateOptions.label}}</label>
          <select [id]="key" [formControlName]="key" (change)="inputChange($event, 'value')" class="c-select form-control" [(ngModel)]="model"
          (focus)="onInputFocus()"
          [disabled]="templateOptions.disabled"
          #selectElement>
            <option value="" *ngIf="templateOptions.placeholder">{{templateOptions.placeholder}}</option>
            <option *ngFor="let opt of templateOptions.options" [value]="opt.value">{{opt.label}}</option>
          </select>
          <small class="text-muted">{{templateOptions.description}}</small>
        </div>
    `,
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  queries: {inputComponent: new ViewChildren("selectElement")}
})
export class FormlyFieldSelect extends Field {
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
