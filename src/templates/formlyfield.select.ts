
import {Component} from "angular2/core";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyMessages} from "../services/formly.messages";
import {Field} from "./field";
@Component({
    selector: 'formly-field-select',
    templateUrl: 'src/templates/select.html'
})
export class FormlyFieldSelect extends Field {
    constructor(fm: FormlyMessages, ps:FormlyPubSub) {
        super(fm, ps);
    }
}