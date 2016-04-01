import {Subject} from 'rxjs/Subject';

export class FormlyEventEmitter extends Subject<String> {
    constructor() {
        super();
    }
    emit(value) {
        super.next(value);
    }
}

export class FormlyPubSub {
    Stream: FormlyEventEmitter;
    updated = false;
    constructor() {
        this.Stream = new FormlyEventEmitter();
    }
    
    getUpdated() {
        return this.updated;
    }
    setUpdated(value) {
        this.updated = value;
    }
    
}