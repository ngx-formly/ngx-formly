import {Component, OnInit, Input} from "@angular/core";
import {ControlGroup, NgFormModel} from "@angular/common";
import {FormlyField} from "./formly.field";
import {ControlService} from "./../services/control.service";
import {FormlyPubSub, FormlyEventEmitter} from "./../services/formly.event.emitter";
import { FormlyCommon } from "./formly.common.component";

@Component({
  selector: "formly-form",
  directives: [FormlyField],
  template: `
        <form class="formly"
            role="form" novalidate [ngFormModel]="form">
            <div class="formly-field"
                *ngFor="let field of fields"
                [ngClass]="field.className">
                <formly-field [model]="model" [key]="field.key" [form]="form" [field]="field" (changeFn)="changeFunction($event, field)" [eventEmitter]="event"></formly-field>
            </div>
            <ng-content></ng-content>
        </form>
    `,
  providers: [NgFormModel, FormlyPubSub, ControlService]
})
export class FormlyForm extends FormlyCommon implements OnInit  {
  // Inputs
  @Input() fields;
  @Input() changeEmitter;

  // Local Variables
  @Input() form: ControlGroup;
  event;

  constructor(private _cs: ControlService, private _fm: NgFormModel, private ps: FormlyPubSub) {
    super();
    this.event = new FormlyEventEmitter();
  }
  ngOnInit() {
    if (!this.model) {
      this.model = {};
    }
    this.form = this._cs.toControlGroup(this.fields, this.model, undefined, undefined);
    if (this.changeEmitter) {
      this.changeEmitter.subscribe((info) => {
        if (info.model) {
          this.model = info.model;
        }
        if (info.fields) {
          this.fields = info.fields;
        }
        this.form = this._cs.toControlGroup(this.fields, this.model, undefined, undefined);
        this.ps.Stream.emit(this.form);
      });
    }
    this.event.subscribe((info) => {
      this.form = this._cs.toControlGroup(this.fields, this.model, info.key, info.value);
      this.ps.Stream.emit(this.form);
    });
  }
  changeFunction(value, field) {
    this.model[field.key] = value;
    this.formSubmit.emit(value);
  }
}
