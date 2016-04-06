import {Component} from 'angular2/core';
import { Field } from './field';
import {FormlyMessages} from './../services/formly.messages';
import {FormlyPubSub} from './../services/formly.event.emitter';

@Component({
    selector: 'formly-field-checkbox',
    templateUrl: 'src/templates/checkbox.html'
})
export class FormlyFieldCheckbox extends Field {
      
      constructor(fm: FormlyMessages, ps:FormlyPubSub) {
        super(fm, ps);
    }
    
}