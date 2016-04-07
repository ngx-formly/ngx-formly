import {Output, Input, EventEmitter} from 'angular2/core';
import {FormlyMessages} from './../services/formly.messages';
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
    inputChange(e, val) {
        this.changeFn.emit(e.target[val]);
        this.ps.setUpdated(true);
    }
}