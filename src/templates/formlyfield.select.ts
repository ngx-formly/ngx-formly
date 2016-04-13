
import {Component} from "angular2/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
    selector: 'formly-field-select',
    template: `
        <div class="select" [ngFormModel]="form">
            <label for="" class="form-control-label">{{options.label}}</label>
            <select [id]="key" [ngControl]="key" (change)="inputChange($event, 'value')" class="c-select">
                <option value="" *ngIf="options.placeholder">{{options.placeholder}}</option>
                <option *ngFor="#opt of options.options" [value]="opt.value">{{opt.label}}</option>
            </select>
            <small class="text-muted">{{options.description}}</small>
        </div>
    `
})
export class FormlyFieldSelect extends Field {
    constructor(fm: FormlyMessages, ps:FormlyPubSub) {
        super(fm, ps);
    }
}