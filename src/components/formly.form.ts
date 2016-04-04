import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {ControlGroup, NgFormModel} from 'angular2/common';
import {FormlyField} from './formly.field';
import {ControlService} from './../services/control.service';
import {FormlyPubSub} from './../services/formly.event.emitter';

@Component({
    selector: 'formly-form',
    directives: [FormlyField],
    template: `
        <form class="formly"
            role="form" novalidate [ngFormModel]="form">
            <div class="formly-field"
                *ngFor="#field of fields"
                [ngClass]="field.className">
                <formly-field [hide]="field.hideExpression" [type]="field.type" [model]="model[field.key]" [key]="field.key" [form]="form" [options]="field.templateOptions" [field]="field" (changeFn)="changeFunction($event, field)"></formly-field>
            </div>
            <ng-content></ng-content>
        </form>
    `,
    providers: [NgFormModel]
})
export class FormlyForm implements OnInit {
    
    //Inputs
    @Input() model: Object;
    @Input() fields;
    @Input() changeEmitter;
    
    //Outputs
    @Output() formSubmit = new EventEmitter();
    
    //Local Variables
    form: ControlGroup;
    _model;
    
    constructor(private _cs: ControlService, private _fm: NgFormModel, private ps: FormlyPubSub) {}
    ngOnInit(){
        this._model = Object.assign({}, this.model);
        this.form = this._cs.toControlGroup(this.fields, this.model);
        if(this.changeEmitter) {
            this.changeEmitter.subscribe((info) => {
                if(info.model) {
                    this.model = info.model;
                }
                if(info.fields) {
                    this.fields = info.fields;
                }
                this.form = this._cs.toControlGroup(this.fields, this.model);
                this.ps.Stream.emit(this.form);
            })
        }
    }
    changeFunction(value, field){
        this.model[field.key] = value;
        this.formSubmit.emit(value);
    }
}