import {
  Component, OnInit, EventEmitter, ElementRef, Output,
  ViewContainerRef, ViewChild, ComponentRef, Renderer
} from "@angular/core";
import {FormlyCommon} from "./formly.common.component";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyFieldBuilder} from "../services/formly.field.builder";
import {FormlyConfig} from "../services/formly.config";
import {Field} from "../templates/field";

@Component({
  selector: "formly-field",
  template: `
    <template #fieldComponent></template>
    <div *ngIf="field.template && !field.fieldGroup" [innerHtml]="field.template"></div>

    <formly-field *ngFor="let f of field.fieldGroup"
      [hide]="f.hideExpression"
      [model]="model?(f.key ? model[f.key]: model):''"
      [form]="form" [field]="f" [formModel]="formModel"
      (modelChange)="changeModel($event)"
      [ngClass]="f.className">
    </formly-field>
  `,
  inputs: ["field", "formModel", "form", "hide", "model", "key"],
})
export class FormlyField extends FormlyCommon implements OnInit {
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  @ViewChild("fieldComponent", {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
  private fieldComponentRef: ComponentRef<Field>;

  constructor(
    elementRef: ElementRef,
    formlyPubSub: FormlyPubSub,
    renderer: Renderer,
    private formlyConfig: FormlyConfig,
    private formlyFieldBuilder: FormlyFieldBuilder,
  ) {
    super(elementRef, formlyPubSub, renderer);
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
      this.fieldComponentRef = this.formlyFieldBuilder.createChildFields(this.field, this, this.formlyConfig);
      this.fieldComponentRef.instance.formControl.valueChanges.subscribe((event) => {
        this.changeModel(new FormlyValueChangeEvent(this.field.key, event));
      });
      this.formlyPubSub.setEmitter(this.field.key, this.update);
    }
  }

  changeModel(event: FormlyValueChangeEvent) {
    if (this.field.key && this.field.key !== event.key) {
      if (!this.model) {
        this.model = {};
      }

      this.model[event.key] = event.value;
      event = new FormlyValueChangeEvent(this.field.key, this.model);
    }

    this.modelChange.emit(event);
  }
}
