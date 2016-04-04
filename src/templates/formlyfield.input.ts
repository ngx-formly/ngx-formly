import {Component, Output, Input, EventEmitter, DoCheck} from 'angular2/core';
import {FormlyMessages, FormlyMessage} from './../services/formly.messages';
import {FormlyPubSub} from './../services/formly.event.emitter';
import { Field } from './field';

@Component({
    selector: 'formly-field-input',
    templateUrl: 'src/templates/input.html',
    directives: [FormlyMessage]
})
export class FormlyFieldInput extends Field{
    
    constructor(fm: FormlyMessages, ps:FormlyPubSub) {
        super(fm, ps);
    }
}