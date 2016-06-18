import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer
} from "@angular/core";
import {FormlyCommon} from "./formly.common.component";
import {FormlyPubSub, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyFieldVisibilityDelegate, FormlyFieldExpressionDelegate} from "../services/formly.field.delegates";
import {FormlyConfig} from "../services/formly.config";
import {FormlyField} from "./formly.field";
import {FormlyFieldConfig} from "./formly.field.config";

@Component({
  selector: "formly-field-group",
  template: `
        <div class="formly-field"
          *ngFor="let f of field.fieldGroup">
          <formly-field [hide]="f.hideExpression" [model]="model?model[f.key]:''" [key]="f.key" [form]="form" [field]="f"
            [formModel] = "formModel" (changeFn)="changeFunction($event, f)" [ngClass]="f.className" [eventEmitter]="eventEmitter">
          </formly-field>
          <formly-field-group *ngIf="f.fieldGroup" [hide]="field.hideExpression" [model]="f.key ? model[f.key]: model" [key]="f.key" [form]="form" [field]="f"
            [fields]="f.fieldGroup" [formModel]= "formModel" (changeFn)="changeFunction($event, f)" [eventEmitter]="event">
          </formly-field-group>
        </div> 
    `,
  directives: [FormlyField],
  inputs: ["field", "formModel", "form", "hide", "model", "key", "fields"]
})
export class FormlyFieldGroup extends FormlyCommon implements OnInit {

  public fields: FormlyFieldConfig[];
  @Input() public eventEmitter;

  // Outputs
  @Output() changeFn: EventEmitter<any> = new EventEmitter();

  update;

  constructor(protected elem: ElementRef, protected ps: FormlyPubSub, protected formlyConfig: FormlyConfig,
              renderer: Renderer) {
    super(elem, ps, formlyConfig, renderer);
  }

  ngOnInit(): any {
    if (!this.fields) {
      this.fields = this.field.fieldGroup;
    }
  }

  changeFunction(event: FormlyValueChangeEvent, field) {
    if (this.key && this.key === event.key) {
      this._model = event.value;
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    } else if (this.key && this.key !== event.key) {
      this._model[event.key] = event.value;
      this.changeFn.emit(new FormlyValueChangeEvent(this.key, this._model));
      this.formSubmit.emit(event);
    } else {
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    }
  }
}
