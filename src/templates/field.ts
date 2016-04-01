import {Component, Output, Input, EventEmitter, DoCheck} from 'angular2/core';
import {FormlyMessages, FormlyMessage} from './../services/formly.messages';
import {FormlyPubSub} from './../services/formly.event.emitter';


export class Field{
    @Input() form;
    @Output() changeFn: EventEmitter<any> = new EventEmitter();
    messages;
    constructor(fm: FormlyMessages, private ps:FormlyPubSub) {
        this.messages = fm.getMessages();
        this.ps.Stream.subscribe(form => {
            this.form = form;
        });
    }
    inputChange(e) {
        this.changeFn.emit(e.target.value);
        this.ps.setUpdated(true);
    }
}