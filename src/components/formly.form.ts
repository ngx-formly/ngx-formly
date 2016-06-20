import {Component, OnInit, ElementRef, Renderer} from "@angular/core";
import {NgFormModel, FormBuilder} from "@angular/common";
import {FormlyField} from "./formly.field";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyFieldGroup} from "./formly.field.group";
import {FormlyConfig} from "../services/formly.config";

@Component({
  selector: "formly-form",
  directives: [FormlyField, FormlyFieldGroup],
  template: `
            <form class="formly" role="form" novalidate [ngFormModel]="form">
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
  providers: [NgFormModel, FormlyPubSub],
  inputs: ["field", "formModel", "form", "hide", "model", "key", "fields"]
})
export class FormlyForm extends FormlyFieldGroup implements OnInit  {

  event;

  constructor(elem: ElementRef, protected _fm: NgFormModel, ps: FormlyPubSub, private fb: FormBuilder,
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
