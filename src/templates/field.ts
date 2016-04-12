import {Output, Input, EventEmitter, OnInit, ElementRef, AfterViewInit, AfterViewChecked} from 'angular2/core';
import {FormlyMessages} from './../services/formly.messages';
import {FormlyPubSub} from './../services/formly.event.emitter';


export class Field implements OnInit{

    @Input() form;
    @Input() update;
    @Input() options;
    @Output() changeFn: EventEmitter<any> = new EventEmitter();
    
    messages;
    constructor(fm: FormlyMessages, private ps:FormlyPubSub) {
        this.messages = fm.getMessages();
        this.ps.Stream.subscribe(form => {
            this.form = form;
        });
    }
    ngOnInit() {
        if(this.update) {
            this.update.subscribe((update) => {
                this.options[update.key] = update.value;
            })
        }
    }
    inputChange(e, val) {
        this.changeFn.emit(e.target[val]);
        this.ps.setUpdated(true);
    }
}