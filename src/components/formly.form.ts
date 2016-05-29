import {Component, OnInit, Input, ElementRef} from "@angular/core";
import {ControlGroup, NgFormModel, FormBuilder} from "@angular/common";
import {FormlyField} from "./formly.field";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyFieldConfig} from "./formly.field.config";
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
                <formly-field *ngIf="!f.fieldGroup" [hide]="f.hideExpression" [viewModel]="viewModel[f.key]"
                  [key]="f.key" [form]="form" [field]="f" [formModel]= "viewModel"
                  (changeFn)="changeFunction($event, field)" [eventEmitter]="event">
                </formly-field>
                <formly-field-group *ngIf="f.fieldGroup" [hide]="f.hideExpression"
                  [viewModel]="f.key ? viewModel[f.key]: viewModel" [key]="f.key" [form]="form" [field]="f"
                  [formModel]= "viewModel" (changeFn)="changeFunction($event, f)" [eventEmitter]="event">
                </formly-field-group>
              </div>
              <ng-content></ng-content>
            </form>
            `,
  providers: [NgFormModel, FormlyPubSub],
  inputs: ["field", "formModel", "form", "hide", "viewModel", "key", "fields"]
})
export class FormlyForm extends FormlyFieldGroup implements OnInit  {

  event;

  constructor(elem: ElementRef, protected _fm: NgFormModel, ps: FormlyPubSub, private fb: FormBuilder,
              formlyConfig: FormlyConfig) {
    super(elem, ps, formlyConfig);
    this.event = new FormlyEventEmitter();
  }
  ngOnInit() {
    if (!this._viewModel) {
      this._viewModel = {};
    }
    if(!this.formModel) {
      this.formModel = this.viewModel;
    }
    if (!this.form) {
      this.form = this.fb.group({});
    }
  }
  changeFunction(event: FormlyValueChangeEvent, field) {
    this._viewModel[event.key] = event.value;
    this.formSubmit.emit(event);
  }
}
