import {Component, OnInit, Input, Output, EventEmitter, DynamicComponentLoader, ElementRef} from 'angular2/core';
import {FormlyPubSub} from './../services/formly.event.emitter';
import { FormlyCommon } from './formly.common.component';
import {FormlyConfig} from "../services/formly.config";

@Component({
    selector: 'formly-field',
    template: `
        <div #child></div>
        <div *ngIf="field.template" [innerHtml]="field.template"></div>
         <div class="formly-field"
            *ngFor="#f of field.fieldGroup"
            [ngClass]="f.className">
            <formly-field [hide]="f.hideExpression" [model]="model" [key]="f.key" [form]="form" [field]="f" (changeFn)="changeFunction($event, f)"></formly-field>
        </div> 
    `,
    directives: [FormlyField]
})
export class FormlyField extends FormlyCommon implements OnInit {
    //Inputs and Outputs
    @Input() model;
    @Input() key;
    @Input() form;
    @Input() field;
    
    //Outputs
    @Output() changeFn: EventEmitter<any> = new EventEmitter();
    
    //Local Variables
    component;
    directives;
    constructor(protected dcl: DynamicComponentLoader, protected elem: ElementRef, private ps: FormlyPubSub, fc: FormlyConfig) {
        super();
        this.directives = fc.getDirectives();
     }
    ngOnInit() {
        if(!!this.field.hideExpression || this.field.hideExpression === undefined && !this.field.template && !this.field.fieldGroup) {
            this.component = this.dcl.loadIntoLocation(this.directives[this.field.type], this.elem, 'child').then(ref => {
                ref.instance.model = this.model[this.field.key];
                ref.instance.type = this.field.type;
                ref.instance.options = this.field.templateOptions;
                ref.instance.changeFn.subscribe((value)=> {
                    this.changeFn.emit(value);
                });
                ref.instance.key = this.key;
                ref.instance.form = this.form;
            });
        }
    }
}