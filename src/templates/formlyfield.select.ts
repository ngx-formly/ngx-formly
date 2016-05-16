
import {Component} from "@angular/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
  selector: "formly-field-select",
  template: `
        <div class="select" [ngFormModel]="form">
          <label for="" class="form-control-label">{{templateOptions.label}}</label>
          <select [id]="key" [ngControl]="key" (change)="inputChange($event, 'value')" class="c-select">
            <option value="" *ngIf="templateOptions.placeholder">{{templateOptions.placeholder}}</option>
            <option *ngFor="let opt of templateOptions.options" [value]="opt.value">{{opt.label}}</option>
          </select>
          <small class="text-muted">{{templateOptions.description}}</small>
        </div>
    `
})
export class FormlyFieldSelect extends Field {
  constructor(fm: FormlyMessages, ps: FormlyPubSub) {
    super(fm, ps);
  }
}
