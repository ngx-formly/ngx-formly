
import {Component, Renderer} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

@Component({
  selector: "formly-field-select",
  template: `
        <div class="select" [formGroup]="form">
          <label for="" class="form-control-label">{{templateOptions.label}}</label>
          <select [id]="key" [formControlName]="key" (change)="inputChange($event, 'value')" class="c-select" [(ngModel)]="model">
            <option value="" *ngIf="templateOptions.placeholder">{{templateOptions.placeholder}}</option>
            <option *ngFor="let opt of templateOptions.options" [value]="opt.value">{{opt.label}}</option>
          </select>
          <small class="text-muted">{{templateOptions.description}}</small>
        </div>
    `,
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "model"],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class FormlyFieldSelect extends Field {
  constructor(fm: FormlyMessages, ps: FormlyPubSub, renderer: Renderer) {
    super(fm, ps, renderer);
  }
}
