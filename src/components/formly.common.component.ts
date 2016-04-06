import { Input, Output, EventEmitter } from 'angular2/core';

export class FormlyCommon {
    @Input() model: Object;
    @Output() formSubmit = new EventEmitter();

    changeFunction(value, field){
        this.model[field.key] = value;
        this.formSubmit.emit(value);
    }
}