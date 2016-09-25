import {Component, OnInit, ElementRef, Renderer, Input} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {FormlyPubSub, FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyFieldBuilder} from "../services/formly.field.builder";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";
import {FormlyCommon} from "./formly.common.component";
import {FormlyFieldConfig} from "./formly.field.config";

@Component({
  selector: "formly-form",
  template: `
    <formly-field *ngFor="let field of fields"
      [hide]="field.hideExpression" [model]="field.key?model[field.key]:model"
      [key]="field.key" [form]="form" [field]="field" [formModel]="model"
      (modelChange)="changeModel($event)"
      [ngClass]="field.className">
    </formly-field>
    <ng-content></ng-content>
  `,
  providers: [FormlyPubSub, SingleFocusDispatcher, FormlyFieldBuilder],
  inputs: ["field", "formModel", "form", "hide", "model"]
})
export class FormlyForm extends FormlyCommon implements OnInit  {
  @Input() fields: FormlyFieldConfig[];

  constructor(
    elementRef: ElementRef,
    formlyPubSub: FormlyPubSub,
    renderer: Renderer,
    private formBuilder: FormBuilder
  ) {
    super(elementRef, formlyPubSub, renderer);
  }

  ngOnInit() {
    if (!this.model) {
      this.model = {};
    }
    if (!this.formModel) {
      this.formModel = this.model;
    }
    if (!this.form) {
      this.form = this.formBuilder.group({});
    }
  }

  changeModel(event: FormlyValueChangeEvent) {
    this.model[event.key] = event.value;
  }
}
