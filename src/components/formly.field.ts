import {
  Component, OnInit, EventEmitter, ElementRef,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChange, OnChanges, Renderer
} from "@angular/core";
import {FormlyCommon} from "./formly.common.component";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyFieldBuilder} from "../services/formly.field.builder";
import {FormlyConfig} from "../services/formly.config";
import {Field} from "../templates/field";

@Component({
  selector: "formly-field",
  template: `
    <template #child></template>
    <div *ngIf="field.template && !field.fieldGroup" [innerHtml]="field.template"></div>

    <formly-field *ngFor="let f of field.fieldGroup"
      [hide]="f.hideExpression"
      [model]="model?(f.key ? model[f.key]: model):''"
      [form]="form" [field]="f" [formModel] = "formModel"
      (changeFn)="changeFunction($event)"
      [ngClass]="f.className">
    </formly-field>
  `,
  inputs: ["field", "formModel", "form", "hide", "model", "key"],
  outputs: ["formSubmit", "changeFn"]
})
export class FormlyField extends FormlyCommon implements OnInit, OnChanges {
  // Outputs
  changeFn: EventEmitter<any> = new EventEmitter();

  // FIXME: See https://github.com/formly-js/ng2-formly/issues/45; This is a temporary fix.
  modelUpdateEmitter: EventEmitter<any> = new EventEmitter();

  @ViewChild("child", {read: ViewContainerRef}) myChild: ViewContainerRef;
  private childFieldRef: ComponentRef<Field>;

  constructor(
    elementRef: ElementRef,
    formlyPubSub: FormlyPubSub,
    formlyConfig: FormlyConfig,
    renderer: Renderer,
    private formlyFieldBuilder: FormlyFieldBuilder,
  ) {
    super(elementRef, formlyPubSub, formlyConfig, renderer);
  }

  ngOnInit() {
    // FIXME: setTimeout may not be good idea. This is a temporary fix for following issue
    /* core.umd.js:5995 EXCEPTION: Error in ./FormlyFieldRadio class FormlyFieldRadio - inline template:1:4
    caused by: Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'.

    This is caused in demo application because when email form control with validation error is added to form the
    ngClassValid attribute of formGroup directive in radio button template changes from true to false. This whole thing
    happens within changedetection and ngonInit lifecycle.

    See https://github.com/angular/angular/issues/10131 for more information*/
    setTimeout(() => this.createChildFields());
  }

  createChildFields() {
    if (this.field && !this.field.template && !this.field.fieldGroup) {
      this.update = new FormlyEventEmitter();
      this.childFieldRef = this.formlyFieldBuilder.createChildFields(this.field, this, this.formlyConfig);
      this.childFieldRef.instance.modelUpdateReceiver = this.modelUpdateEmitter;
      this.childFieldRef.instance.changeFn.subscribe((event) => this.changeFunction(event));
      this.formlyPubSub.setEmitter(this.field.key, this.update);
    }
  }

  changeFunction(event: FormlyValueChangeEvent) {
    if (this.field.key && this.field.key === event.key) {
      this._model = event.value;
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    } else if (this.field.key && this.field.key !== event.key) {
      if (!this._model) {
        this.model = {};
      }
      this._model[event.key] = event.value;
      this.changeFn.emit(new FormlyValueChangeEvent(this.field.key, this._model));
      this.formSubmit.emit(event);
    } else {
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    }
  }

  ngOnChanges(changes: {
    [key: string]: SimpleChange;
  }): any {
    if (changes["model"]) {
      // FIXME: See https://github.com/formly-js/ng2-formly/issues/45. This is a temporary fix.
      this.modelUpdateEmitter.emit(changes["model"].currentValue);
    }
  }
}
