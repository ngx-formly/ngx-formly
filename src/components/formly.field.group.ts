import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef} from "@angular/core";
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
          <formly-field [hide]="f.hideExpression" [viewModel]="viewModel?viewModel[f.key]:''" [key]="f.key" [form]="form" [field]="f"
            [formModel] = "formModel" (changeFn)="changeFunction($event, f)" [ngClass]="field.className" [eventEmitter]="eventEmitter">
          </formly-field>
          <formly-field-group *ngIf="f.fieldGroup" [hide]="field.hideExpression" [viewModel]="f.key ? model[f.key]: model" [key]="f.key" [form]="form" [field]="f"
            [fields]="f.fieldGroup" [formModel]= "formModel" (changeFn)="changeFunction($event, f)" [eventEmitter]="event">
          </formly-field-group>
        </div> 
    `,
  directives: [FormlyField],
  inputs: ["field", "formModel", "form", "hide", "viewModel", "key", "fields"]
})
export class FormlyFieldGroup extends FormlyCommon implements OnInit {

  @Input() public fields: FormlyFieldConfig[];
  @Input() public eventEmitter;

  // Outputs
  @Output() changeFn: EventEmitter<any> = new EventEmitter();

  update;

  constructor(protected elem: ElementRef, protected ps: FormlyPubSub, protected formlyConfig: FormlyConfig) {
    super(elem, ps, formlyConfig);
  }

  ngOnInit(): any {

  }


  changeFunction(event: FormlyValueChangeEvent, field) {
    if (this.key && this.key === event.key) {
      this._viewModel = event.value;
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    } else if (this.key && this.key !== event.key) {
      this._viewModel[event.key] = event.value;
      this.changeFn.emit(new FormlyValueChangeEvent(this.key, this._viewModel));
      this.formSubmit.emit(event);
    } else {
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    }
  }
}
