import {Component, ElementRef, OnInit, AfterContentInit, AfterViewInit} from 'angular2/core';
import {FormlyMessages, FormlyMessage} from './../services/formly.messages';
import {FormlyPubSub} from './../services/formly.event.emitter';
import { Field } from './field';

@Component({
    selector: 'formly-field-input',
    templateUrl: 'src/templates/input.html',
    directives: [FormlyMessage]
})
export class FormlyFieldInput extends Field implements AfterViewInit{

    
    constructor(fm: FormlyMessages, ps:FormlyPubSub, private elem: ElementRef) {
        super(fm, ps);
    }
    ngAfterViewInit() {
        if(this.options.focus) {
            this.elem.nativeElement.querySelector('input').focus();
        }
    }
}