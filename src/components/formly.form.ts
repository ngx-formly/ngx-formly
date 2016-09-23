import {Component, OnInit, ElementRef, Renderer, Input} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyConfig} from "../services/formly.config";
import {FormlyFieldBuilder} from "../services/formly.field.builder";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";
import {FormlyCommon} from "./formly.common.component";
import {FormlyFieldConfig} from "./formly.field.config";

@Component({
  selector: "formly-form",
  template: `
    <formly-field *ngFor="let f of fields"
      [hide]="f.hideExpression" [model]="f.key?model[f.key]:model"
      [key]="f.key" [form]="form" [field]="f" [formModel]= "model"
      (changeFn)="changeFunction($event, f)" [eventEmitter]="event"
      [ngClass]="f.className">
    </formly-field>
    <ng-content></ng-content>
  `,
  providers: [FormlyPubSub, SingleFocusDispatcher, FormlyFieldBuilder],
  inputs: ["field", "formModel", "form", "hide", "model"]
})
export class FormlyForm extends FormlyCommon implements OnInit  {
  @Input() fields: FormlyFieldConfig[];
  event: FormlyEventEmitter = new FormlyEventEmitter();

  constructor(elem: ElementRef, ps: FormlyPubSub, private fb: FormBuilder,
              formlyConfig: FormlyConfig, renderer: Renderer) {
    super(elem, ps, formlyConfig, renderer);
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
