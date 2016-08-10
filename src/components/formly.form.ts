import {Component, OnInit, ElementRef, Renderer} from "@angular/core";
import {FormBuilder, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FORM_PROVIDERS} from "@angular/forms";
import {FormlyField} from "./formly.field";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyFieldGroup} from "./formly.field.group";
import {FormlyConfig} from "../services/formly.config";
import {FormlyFieldBuilder} from "../services/formly.field.builder";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";
import {NgFormModel} from "@angular/common";

@Component({
  selector: "formly-form",
  directives: [FormlyField, FormlyFieldGroup, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  template: `
            <form class="formly" role="form" novalidate [formGroup]="form">
              <div class="formly-field"
                *ngFor="let f of fields"
                [ngClass]="f.className">
                <formly-field *ngIf="!f.fieldGroup" [hide]="f.hideExpression" [model]="model[f.key]"
                  [key]="f.key" [form]="form" [field]="f" [formModel]= "model"
                  (changeFn)="changeFunction($event, field)" [eventEmitter]="event">
                </formly-field>
                <formly-field-group *ngIf="f.fieldGroup" [hide]="f.hideExpression" [fields]="f.fieldGroup"
                  [model]="f.key ? model[f.key]: model" [key]="f.key" [form]="form" [field]="f"
                  [formModel]= "model" (changeFn)="changeFunction($event, f)" [eventEmitter]="event">
                </formly-field-group>
              </div>
              <ng-content></ng-content>
            </form>
            `,
  providers: [NgFormModel, FormlyPubSub, SingleFocusDispatcher, FormlyFieldBuilder, FORM_PROVIDERS],
  inputs: ["field", "formModel", "form", "hide", "model", "key", "fields"]
})
export class FormlyForm extends FormlyFieldGroup implements OnInit  {

  event: FormlyEventEmitter;

  constructor(elem: ElementRef, ps: FormlyPubSub, private fb: FormBuilder,
              formlyConfig: FormlyConfig, renderer: Renderer) {
    super(elem, ps, formlyConfig, renderer);
    this.event = new FormlyEventEmitter();
  }
  ngOnInit() {
    if (!this._model) {
      this._model = {};
    }
    if (!this.formModel) {
      this.formModel = this.model;
    }
    if (!this.form) {
      this.form = this.fb.group({});
    }
  }
  changeFunction(event: FormlyValueChangeEvent, field) {
    this._model[event.key] = event.value;
    this.formSubmit.emit(event);
  }
}
