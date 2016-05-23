import {Component, OnInit, Input} from "@angular/core";
import {ControlGroup, NgFormModel, FormBuilder} from "@angular/common";
import {FormlyField} from "./formly.field";
import {FormlyPubSub, FormlyEventEmitter} from "./../services/formly.event.emitter";
import {FormlyCommon} from "./formly.common.component";
import {FormlyFieldConfig} from "./formly.field.config";

@Component({
  selector: "formly-form",
  directives: [FormlyField],
  template: `
            <form class="formly" role="form" novalidate [ngFormModel]="form">
              <div class="formly-field"
                  *ngFor="let field of fields"
                  [ngClass]="field.className">
                  <formly-field [hide]="field.hideExpression" [model]="model" [key]="field.key" [form]="form" [field]="field"
                    (changeFn)="changeFunction($event, field)" [eventEmitter]="event">
                  </formly-field>
              </div>
              <ng-content></ng-content>
            </form>
            `,
  providers: [NgFormModel, FormlyPubSub]
})
export class FormlyForm extends FormlyCommon implements OnInit  {
  // Inputs
  @Input()
  public get fields(): FormlyFieldConfig[] {
    return this._fields;
  }

  public set fields(value) {
    this._fields = value;
    this.ps.Stream.emit(this.form);
  }
  @Input()
  public get model() {
    return this._model;
  };

  public set model(value) {
    this._model = value;
    this.ps.Stream.emit(this.form);
  }

  // Local Variables
  @Input() form: ControlGroup;
  event;
  private _model;
  private _fields: FormlyFieldConfig[];

  constructor(private _fm: NgFormModel, private ps: FormlyPubSub, private fb: FormBuilder) {
    super();
    this.event = new FormlyEventEmitter();
  }
  ngOnInit() {
    if (!this.model) {
      this.model = {};
    }
    this.form = this.fb.group({});
  }
  changeFunction(value, field) {
    this.model[field.key] = value;
    this.formSubmit.emit(value);
  }
}
